import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../State/Auth/Action';
import { deleteUser } from '../State/User/Action';
import './Dashboard.css';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const role = String(useSelector((state) => state.auth.role) || localStorage.getItem('role') || '').toUpperCase();
  const isAdmin = role === 'ADMIN';

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    setIsDeleting(true);
    const result = await dispatch(deleteUser());
    setIsDeleting(false);
    if (result.success) navigate('/register');
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link className="dashboard-brand" to="/dashboard">+</Link>
        <span className="dashboard-label">Careline</span>
        <button className="dashboard-button dashboard-logout" type="button" onClick={handleLogout}>Log out</button>
      </header>

      <div className="dashboard-grid">
        <aside className="dashboard-sidebar">
          <p className="dashboard-eyebrow">Your space</p>
          <h1>Stay close to what matters.</h1>
          <Link className="dashboard-button users-button" to="/users">View users <span aria-hidden="true">→</span></Link>
        </aside>

        <section className="dashboard-content" aria-labelledby="dashboard-title">
          <p className="dashboard-eyebrow">Dashboard</p>
          <h2 id="dashboard-title">Everything in one calm place.</h2>
          <p className="dashboard-intro">Manage your account and find your community from here.</p>
          <div className="dashboard-actions">
            <Link className="action-card" to="/profile">
              <span className="action-number">01</span>
              <strong>View my profile</strong>
              <span>See your profile details <span aria-hidden="true">→</span></span>
            </Link>
            <Link className="action-card" to="/create-post">
              <span className="action-number">02</span>
              <strong>Create a post</strong>
              <span>Share a caption, image, and video <span aria-hidden="true">→</span></span>
            </Link>
            <Link className="action-card" to="/posts">
              <span className="action-number">03</span>
              <strong>See all posts</strong>
              <span>Browse top posts and community updates <span aria-hidden="true">→</span></span>
            </Link>
            <Link className="action-card" to="/users">
              <span className="action-number">04</span>
              <strong>Create Chat</strong>
              <span>Choose a user and start a conversation <span aria-hidden="true">→</span></span>
            </Link>
            <Link className="action-card" to="/chats">
              <span className="action-number">05</span>
              <strong>See your chats</strong>
              <span>View conversations you belong to <span aria-hidden="true">→</span></span>
            </Link>
            {isAdmin && (
              <Link className="action-card" to="/admin/chats">
                <span className="action-number">06</span>
                <strong>Show all chats</strong>
                <span>Review all conversations as an admin <span aria-hidden="true">→</span></span>
              </Link>
            )}
            <button className="action-card danger-card" type="button" onClick={handleDeleteAccount} disabled={isDeleting}>
              <span className="action-number">07</span>
              <strong>{isDeleting ? 'Deleting account...' : 'Delete my account'}</strong>
              <span>Remove your account permanently <span aria-hidden="true">→</span></span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;