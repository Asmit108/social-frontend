import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { changeUserRole, deleteAdminUser, findAllUsers, findOwnProfile, followUser } from '../State/User/Action';
import { createChat } from '../State/Chat/Action';
import './Dashboard.css';

function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [], profile, usersLoading, usersError } = useSelector((state) => state.user);
  const authRole = useSelector((state) => state.auth.role);
  const [filters, setFilters] = useState({ id: '', firstName: '', lastName: '', email: '', role: '', gender: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('USER');
  const [followedUsers, setFollowedUsers] = useState({});
  const [creatingChatUserId, setCreatingChatUserId] = useState(null);
  const [chatError, setChatError] = useState('');
  const currentRole = String(authRole || localStorage.getItem('role') || '').toUpperCase();
  const isAdmin = currentRole === 'ADMIN';
  const canFollow = currentRole === 'USER' || currentRole === 'ADMIN';

  const mergedUsers = useMemo(() => {
    const list = [...users];
    const currentUserId = profile ? (profile.id ?? profile.userId) : null;

    if (currentUserId && !list.some((user) => String(user?.id ?? user?.userId) === String(currentUserId))) {
      list.unshift(profile);
    }

    return list;
  }, [profile, users]);

  useEffect(() => {
    dispatch(findAllUsers());
    dispatch(findOwnProfile());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const validUsers = mergedUsers.filter((user) => user && Object.values(user).some((value) => value !== null && value !== undefined && String(value).trim() !== ''));
    return validUsers.filter((user) => Object.entries(filters).every(([field, value]) => (
      !value || String(user[field] ?? '').toLowerCase().includes(value.trim().toLowerCase())
    )));
  }, [filters, mergedUsers]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  };

  const handleEditRole = (user) => {
    setEditingUserId(user.id || user.userId);
    setSelectedRole(String(user.role || 'USER').toUpperCase());
  };

  const handleRoleSave = async (userId) => {
    await dispatch(changeUserRole(userId, selectedRole));
    setEditingUserId(null);
    dispatch(findAllUsers());
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await dispatch(deleteAdminUser(userId));
    await dispatch(findAllUsers());
  };

  const handleFollowUser = async (userId) => {
    const result = await dispatch(followUser(userId));
    if (result.success) setFollowedUsers((current) => ({ ...current, [userId]: !current[userId] }));
  };

  const handleCreateChat = async (userId) => {
    setCreatingChatUserId(userId);
    setChatError('');
    const result = await dispatch(createChat(userId));
    setCreatingChatUserId(null);
    if (result.success) {
      navigate('/chats');
    } else {
      setChatError(result.error || 'Unable to create chat.');
    }
  };

  return (
    <main className="dashboard-page users-page">
      <header className="dashboard-header">
        <Link className="dashboard-brand" to="/dashboard">+</Link>
        <span className="dashboard-label">Community users</span>
        <Link className="dashboard-button dashboard-logout" to="/dashboard">Dashboard</Link>
      </header>
      <section className="users-panel" aria-labelledby="users-title">
        <p className="dashboard-eyebrow">Your community</p>
        <h1 id="users-title">Find a user.</h1>
        {chatError && <p className="profile-message error-message" role="alert">{chatError}</p>}
        {!usersLoading && !usersError && <p className="profile-message">Showing {filteredUsers.length} user{filteredUsers.length === 1 ? '' : 's'}</p>}
        <div className="user-filters">
          {Object.keys(filters).map((field) => <input key={field} name={field} type="search" value={filters[field]} onChange={handleFilterChange} placeholder={`Filter ${field === 'firstName' ? 'first name' : field === 'lastName' ? 'last name' : field}`} aria-label={`Filter by ${field}`} />)}
        </div>
        {usersLoading && <p className="profile-message">Loading users...</p>}
        {usersError && <p className="profile-message error-message" role="alert">Unable to load users.</p>}
        {!usersLoading && !usersError && <div className="users-table-wrap">
          {filteredUsers.length ? <table className="users-table">
            <thead><tr><th>ID</th><th>First name</th><th>Last name</th><th>Email</th><th>Role</th><th>Gender</th><th>Actions</th></tr></thead>
            <tbody>{filteredUsers.map((user, index) => { const userId = user.id || user.userId; const isCurrentUser = String(profile?.id ?? profile?.userId) === String(userId); return <tr key={userId || user.email || `user-${index}`}><td>{userId || 'Not provided'}</td><td>{isCurrentUser ? `${user.firstName || 'You'}` : (user.firstName || 'Not provided')}{isCurrentUser && ' (You)'}</td><td>{isCurrentUser ? `${user.lastName || ''}` : (user.lastName || 'Not provided')}</td><td>{user.email || 'Not provided'}</td><td><div className="role-cell"><span>{user.role || 'Not provided'}</span>{isAdmin && userId && !isCurrentUser && (editingUserId === userId ? <><select className="role-select" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select><button className="table-action save-action" type="button" onClick={() => handleRoleSave(userId)}>Save</button></> : <button className="table-action" type="button" onClick={() => handleEditRole(user)}>Edit</button>)}</div></td><td>{user.gender || 'Not provided'}</td><td><div className="user-actions">{userId && !isCurrentUser && <button className="table-action" type="button" disabled={creatingChatUserId === userId} onClick={() => handleCreateChat(userId)}>{creatingChatUserId === userId ? 'Creating...' : 'Create chat'}</button>}{canFollow && userId && !isCurrentUser && <button className="table-action" type="button" onClick={() => handleFollowUser(userId)}>{followedUsers[userId] ? 'UNFOLLOW' : 'Follow'}</button>}{isAdmin && userId && !isCurrentUser && <button className="table-action delete-action" type="button" onClick={() => handleDeleteUser(userId)}>Delete</button>}</div></td></tr>; })}</tbody>
          </table> : <p className="profile-message">No users match your filters.</p>}
        </div>}
      </section>
    </main>
  );
}

export default User;
