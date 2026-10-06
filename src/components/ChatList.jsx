import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteChat, deleteOwnChat, findAllChats, findUserChats } from '../State/Chat/Action';
import { findOwnProfile } from '../State/User/Action';
import './Dashboard.css';

const getChatList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.chats)) return data.chats;
  return [];
};

const getMemberId = (member) => (member && typeof member === 'object' ? member.id ?? member.userId : member);

const getMemberName = (member) => {
  if (!member || typeof member !== 'object') return 'Community member';
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ');
  return fullName || member.name || member.username || 'Community member';
};

function ChatList({ adminOnly = false }) {
  const dispatch = useDispatch();
  const role = String(useSelector((state) => state.auth.role) || localStorage.getItem('role') || '').toUpperCase();
  const isAdmin = role === 'ADMIN';
  const { userChats = [], allChats = [], isLoading, error } = useSelector((state) => state.chat);
  const profile = useSelector((state) => state.user.profile);
  const currentUserId = profile?.id ?? profile?.userId;
  const chats = adminOnly ? allChats : userChats;
  const [deletingChatId, setDeletingChatId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (adminOnly && isAdmin) {dispatch(findAllChats());console.log("Admin chat list fetched.");}
    if (!adminOnly) {dispatch(findUserChats());console.log("User chat list fetched.");}
  }, [adminOnly, dispatch, isAdmin]);

  useEffect(() => {
    if (!adminOnly && !profile) dispatch(findOwnProfile());
  }, [adminOnly, dispatch, profile]);

  const normalizedChats = getChatList(chats);

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm('Delete this chat?')) return;

    setDeletingChatId(chatId);
    setDeleteError('');
    const result = adminOnly
      ? await dispatch(deleteChat(chatId))
      : await dispatch(deleteOwnChat(chatId));
    setDeletingChatId(null);

    if (!result.success) {
      setDeleteError(result.error || 'Unable to delete chat.');
      return;
    }

    if (adminOnly) dispatch(findAllChats());
    else dispatch(findUserChats());
  };

  return (
    <main className="dashboard-page users-page">
      <header className="dashboard-header">
        <Link className="dashboard-brand" to="/dashboard">+</Link>
        <span className="dashboard-label">{adminOnly ? 'All chats' : 'Your chats'}</span>
        <Link className="dashboard-button dashboard-logout" to="/dashboard">Dashboard</Link>
      </header>
      <section className="users-panel">
        <p className="dashboard-eyebrow">Conversations</p>
        <h1>{adminOnly ? 'All chats.' : 'Your chats.'}</h1>
        {deleteError && <p className="profile-message error-message" role="alert">{deleteError}</p>}
        {adminOnly && !isAdmin ? (
          <p className="profile-message error-message" role="alert">This page is available to administrators only.</p>
        ) : isLoading && !normalizedChats.length ? (
          <p className="profile-message">Loading chats...</p>
        ) : error ? (
          <p className="profile-message error-message" role="alert">Unable to load chats: {error}</p>
        ) : normalizedChats.length ? (
          <div className="post-sections">
            {normalizedChats.map((chat, index) => {
              const chatId = chat.id ?? chat.chatId ?? chat.conversationId ?? index;
              const members = chat.users ?? chat.participants ?? chat.members ?? [chat.user, chat.otherUser].filter(Boolean);
              const participantList = Array.isArray(members) ? members : [];
              const displayedMembers = !adminOnly && currentUserId != null
                ? participantList.filter((member) => String(getMemberId(member)) !== String(currentUserId))
                : participantList;
              const receiverName = [chat.firstName ?? chat.receiverFirstName, chat.lastName ?? chat.receiverLastName].filter(Boolean).join(' ');
              const receiverEmail = chat.email ?? chat.receiverEmail;
              const hasReceiverDetails = Boolean(receiverName || receiverEmail || chat.userId != null);
              const chatTitle = chat.chatName || `Chat ${chat.id ?? chat.chatId ?? `#${index + 1}`}`;
              return (
                <article className="post-panel" key={chatId}>
                  <div className="chat-list-heading">
                    <h2>{chatTitle}</h2>
                    <button
                      type="button"
                      className="table-action delete-action"
                      onClick={() => handleDeleteChat(chatId)}
                      disabled={deletingChatId === chatId}
                    >
                      {deletingChatId === chatId ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  <div className="chat-members">
                    {hasReceiverDetails ? (
                      <div className="chat-member">
                        <strong>{receiverName || 'Chat participant'}</strong>
                        {receiverEmail && <span>{receiverEmail}</span>}
                      </div>
                    ) : displayedMembers.length ? displayedMembers.map((member, memberIndex) => (
                      <div className="chat-member" key={getMemberId(member) ?? memberIndex}>
                        <strong>{getMemberName(member)}</strong>
                        {member && typeof member === 'object' && member.email && <span>{member.email}</span>}
                      </div>
                    )) : <p className="post-content">Other participant details unavailable.</p>}
                  </div>
                  {chat.createdAt && <small>{new Date(chat.createdAt).toLocaleString()}</small>}
                  <Link
                    className="dashboard-button chat-open-button"
                    to={adminOnly ? `/admin/chats/${chatId}/messages` : `/chats/${chatId}/messages`}
                    state={{ chat }}
                  >
                    {adminOnly ? 'View messages' : 'Start chat'}
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="profile-message">No chats to show yet. Start one from the users page.</p>
        )}
      </section>
    </main>
  );
}

export default ChatList;
