import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteAdminPost, deletePost, findAllPosts, findTopPosts, findUserPosts, likePost, savePost } from '../State/Post/Action';
import { createComment, findCommentsByPostId } from '../State/Comment/Action';
import { findOwnProfile } from '../State/User/Action';
import './Dashboard.css';

const getCount = (...values) => {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (Array.isArray(value)) return value.length;
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
      return Number(value);
    }
    if (value && typeof value === 'object') {
      const nestedCount = value.count ?? value.total ?? value.size ?? value.length;
      if (nestedCount !== undefined && Number.isFinite(Number(nestedCount))) return Number(nestedCount);
    }
  }

  return 0;
};

const includesUser = (users, userId) => {
  if (userId == null || !Array.isArray(users)) return false;

  return users.some((user) => {
    const id = user && typeof user === 'object' ? user.id ?? user.userId : user;
    return id != null && String(id) === String(userId);
  });
};

const normalizeComments = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.comments)) return data.comments;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

function Post() {
  const dispatch = useDispatch();
  const { posts = [], topPosts = [], userPosts = [], isLoading, error } = useSelector((state) => state.post);
  const { profile } = useSelector((state) => state.user);
  const authRole = useSelector((state) => state.auth.role) || localStorage.getItem('role');
  const currentRole = String(authRole || '').toUpperCase();
  const isAdmin = currentRole === 'ADMIN';
  const userId = profile?.id ?? profile?.userId;
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [postComments, setPostComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentsLoading, setCommentsLoading] = useState({});
  const [commentSubmitting, setCommentSubmitting] = useState({});
  const [commentsError, setCommentsError] = useState({});

  useEffect(() => {
    dispatch(findAllPosts());
    dispatch(findTopPosts());
    dispatch(findOwnProfile());
    if (userId) {
      dispatch(findUserPosts(userId));
    }
  }, [dispatch, userId]);

  const displayPosts = useMemo(() => {
    return [...posts].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [posts]);

  const handleLikeToggle = async (postId, wasLiked) => {
    const result = await dispatch(likePost(postId));
    if (result.success) {
      setLikedPosts((current) => ({ ...current, [postId]: !wasLiked }));
      dispatch(findAllPosts());
      dispatch(findTopPosts());
      if (userId) dispatch(findUserPosts(userId));
    }
  };

  const handleSaveToggle = async (postId, wasSaved) => {
    const result = await dispatch(savePost(postId));
    if (result.success) {
      setSavedPosts((current) => ({ ...current, [postId]: !wasSaved }));
      dispatch(findAllPosts());
      dispatch(findTopPosts());
      if (userId) dispatch(findUserPosts(userId));
    }
  };

  const loadComments = async (postId) => {
    setCommentsLoading((current) => ({ ...current, [postId]: true }));
    setCommentsError((current) => ({ ...current, [postId]: '' }));
    const result = await dispatch(findCommentsByPostId(postId));
    setCommentsLoading((current) => ({ ...current, [postId]: false }));

    if (result.success) {
      setPostComments((current) => ({ ...current, [postId]: normalizeComments(result.data) }));
      return true;
    }

    setCommentsError((current) => ({ ...current, [postId]: result.error || 'Unable to load comments.' }));
    return false;
  };

  const handleCommentsToggle = async (postId) => {
    if (openComments[postId]) {
      setOpenComments((current) => ({ ...current, [postId]: false }));
      return;
    }

    setOpenComments((current) => ({ ...current, [postId]: true }));
    if (!Object.prototype.hasOwnProperty.call(postComments, postId)) {
      await loadComments(postId);
    }
  };

  const handleCommentSubmit = async (event, postId) => {
    event.preventDefault();
    const content = (commentDrafts[postId] || '').trim();
    if (!content) return;

    setCommentSubmitting((current) => ({ ...current, [postId]: true }));
    setCommentsError((current) => ({ ...current, [postId]: '' }));
    const result = await dispatch(createComment({ content }, postId));
    setCommentSubmitting((current) => ({ ...current, [postId]: false }));

    if (result.success) {
      setCommentDrafts((current) => ({ ...current, [postId]: '' }));
      await loadComments(postId);
    } else {
      setCommentsError((current) => ({ ...current, [postId]: result.error || 'Unable to add comment.' }));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;

    const result = isAdmin
      ? await dispatch(deleteAdminPost(postId))
      : await dispatch(deletePost(postId));

    if (result.success) {
      dispatch(findAllPosts());
      dispatch(findTopPosts());
      if (userId) dispatch(findUserPosts(userId));
    }
  };

  const renderPostCard = (post) => {
    const postId = post.id || post.postId;
    const isOwnPost = String(post.userId ?? post.authorId ?? '') === String(userId ?? '');
    const canDelete = isAdmin || isOwnPost;
    const isLiked = Boolean(likedPosts[postId] ?? post.currentUserLiked ?? post.userLiked ?? (typeof post.liked === 'boolean' ? post.liked : post.isLiked) ?? includesUser(post.liked, userId));
    const isSaved = Boolean(savedPosts[postId] ?? post.currentUserSaved ?? post.userSaved ?? (typeof post.savedUser === 'boolean' ? post.savedUser : post.isSaved) ?? includesUser(post.savedUser, userId));
    const likeCount = getCount(post.likeCount, post.likesCount, post.like_count, post.totalLikes, post.likes, post.likedUsers, post.liked);
    const saveCount = getCount(post.saveCount, post.savedCount, post.save_count, post.totalSaves, post.saves, post.savedUsers, post.savedUser);
    const authorName = post.userName || post.authorName || post.user?.name || 'Community member';

    return (
      <article key={postId || `${authorName}-${Math.random()}`} className="post-card">
        <div className="post-header">
          <div>
            <strong>{authorName}</strong>
            <small>{post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}</small>
          </div>
          {canDelete && (
            <button type="button" className="table-action delete-action" onClick={() => handleDeletePost(postId)}>
              Delete
            </button>
          )}
        </div>

        <p className="post-content">{post.content || post.caption || 'No post content available.'}</p>

        {post.image && <img className="post-image" src={post.image} alt="Post" />}

        <div className="post-actions">
          <button type="button" className="table-action" onClick={() => handleLikeToggle(postId, isLiked)}>
            {isLiked ? 'Unlike' : 'Like'} ({likeCount})
          </button>

          <button type="button" className="table-action" onClick={() => handleSaveToggle(postId, isSaved)}>
            {isSaved ? 'Unsave' : 'Save'} ({saveCount})
          </button>
          <button type="button" className="table-action" onClick={() => handleCommentsToggle(postId)} aria-expanded={Boolean(openComments[postId])}>
            {openComments[postId] ? 'Hide comments' : 'Comment'}
          </button>
        </div>

        {openComments[postId] && (
          <section className="post-comments" aria-label="Post comments">
            <h3>Comments</h3>
            {commentsLoading[postId] ? (
              <p className="profile-message">Loading comments...</p>
            ) : postComments[postId]?.length ? (
              postComments[postId].map((comment, index) => (
                <article className="post-comment" key={comment.id ?? comment.commentId ?? index}>
                  <strong>{comment.user?.name || comment.userName || comment.authorName || 'Community member'}</strong>
                  <p>{comment.content || comment.text || comment.comment || 'Comment'}</p>
                  {comment.createdAt && <small>{new Date(comment.createdAt).toLocaleString()}</small>}
                </article>
              ))
            ) : !commentsError[postId] ? (
              <p className="profile-message">No comments yet. Be the first to comment.</p>
            ) : null}

            {commentsError[postId] && <p className="profile-message error-message" role="alert">{commentsError[postId]}</p>}

            <form className="comment-form" onSubmit={(event) => handleCommentSubmit(event, postId)}>
              <textarea
                aria-label="Write a comment"
                value={commentDrafts[postId] || ''}
                onChange={(event) => setCommentDrafts((current) => ({ ...current, [postId]: event.target.value }))}
                placeholder="Write a comment..."
                rows="2"
                maxLength="1000"
                required
              />
              <button type="submit" className="table-action" disabled={commentSubmitting[postId] || !(commentDrafts[postId] || '').trim()}>
                {commentSubmitting[postId] ? 'Posting...' : 'Post comment'}
              </button>
            </form>
          </section>
        )}
      </article>
    );
  };

  return (
    <main className="dashboard-page users-page">
      <header className="dashboard-header">
        <Link className="dashboard-brand" to="/dashboard">+</Link>
        <span className="dashboard-label">Social feed</span>
        <Link className="dashboard-button dashboard-logout" to="/dashboard">Dashboard</Link>
      </header>

      <section className="users-panel">
        <p className="dashboard-eyebrow">Community feed</p>
        <h1>Top posts, your posts, and updates.</h1>

        {error && <p className="profile-message error-message" role="alert">{error}</p>}

        <div className="post-sections">
          <section className="post-panel">
            <h2>Top posts</h2>
            {isLoading ? <p className="profile-message">Loading posts...</p> : topPosts.length ? topPosts.map((post) => renderPostCard(post)) : <p className="profile-message">No top posts yet.</p>}
          </section>

          <section className="post-panel">
            <h2>Your posts</h2>
            {isLoading ? <p className="profile-message">Loading your posts...</p> : userPosts.length ? userPosts.map((post) => renderPostCard(post)) : <p className="profile-message">You have not posted anything yet.</p>}
          </section>

          <section className="post-panel">
            <h2>All posts</h2>
            {isLoading ? <p className="profile-message">Loading all posts...</p> : displayPosts.length ? displayPosts.map((post) => renderPostCard(post)) : <p className="profile-message">No posts available.</p>}
          </section>
        </div>
      </section>
    </main>
  );
}

export default Post;
