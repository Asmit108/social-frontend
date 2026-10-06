import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createPost } from '../State/Post/Action';
import './Dashboard.css';

function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    caption: '',
    image: '',
    video: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.caption.trim() || !formData.image.trim()) {
      setError('Caption and image are required.');
      return;
    }

    setIsSubmitting(true);

    const result = await dispatch(createPost({
      caption: formData.caption,
      image: formData.image,
      video: formData.video || ''
    }));

    setIsSubmitting(false);

    if (result?.success) {
      navigate('/posts');
      return;
    }

    setError(result?.error || 'Unable to create post.');
  };

  return (
    <main className="dashboard-page create-post-page">
      <header className="dashboard-header">
        <Link className="dashboard-brand" to="/dashboard">+</Link>
        <span className="dashboard-label">Create post</span>
        <button className="dashboard-button dashboard-logout" type="button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </header>
      <div className="create-post-box">
        <h1>Create post</h1>
        <form className="create-post-form" onSubmit={handleSubmit}>
          <label htmlFor="caption">Caption</label>
          <textarea
            id="caption"
            name="caption"
            value={formData.caption}
            onChange={handleChange}
            placeholder="Write your post caption..."
            required
          />

          <label htmlFor="image">Image</label>
          <input
            id="image"
            name="image"
            type="text"
            value={formData.image}
            onChange={handleChange}
            placeholder="Paste image URL"
            required
          />

          <label htmlFor="video">Video</label>
          <input
            id="video"
            name="video"
            type="text"
            value={formData.video}
            onChange={handleChange}
            placeholder="Paste video URL (optional)"
          />

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="primary-button create-post-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating post...' : 'Create post'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreatePost;
