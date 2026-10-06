import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useEffect, useState} from 'react';
import { findOwnProfile, updateUser} from '../State/User/Action';

const Profile = () => {
  const role = localStorage.getItem('role');
  const jwt = localStorage.getItem('jwt');  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  const profileFields = ['email', 'firstName', 'lastName', 'password', 'role', 'gender']

  const editableFields = ['firstName', 'lastName','gender']

  useEffect(() => {
    console.log("Profile component mounted. Role:", role, "JWT:", jwt);
    dispatch(findOwnProfile());
  }, [dispatch, role, jwt]);

  const getFieldValue = (field) => {
    if (profileFields.includes(field)) {
      return profile?.[field] || 'Not provided';
    }
    return 'Not provided';
  };

  const handleEditStart = (field) => {
    const value = getFieldValue(field);
    setEditingField(field);
    setEditValue(value === 'Not provided' ? '' : String(value));
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSaveEdit = async () => {
    if (!editingField) return;

    const payload = {
        [editingField]: editValue
    };

    await dispatch(updateUser(payload));

    handleCancelEdit();
  };

  return (
    <main className="dashboard-page profile-page">
      <header className="dashboard-header"><a className="dashboard-brand" href="/dashboard">Careline<span>+</span></a><button className="profile-button" type="button" onClick={() => navigate('/dashboard')}>← Back to dashboard</button></header>

      <section className="dashboard-body profile-body">
        <p className="dashboard-eyebrow">{role} profile</p>
        <h1>Your profile</h1>

        {!profile ? <p className="profile-message">Loading your profile...</p> : <div className="profile-table-wrapper">
          <table className="profile-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {profileFields.map((field) => (
                <tr key={field}>
                  <th style={{ border: '1px solid #dce1d9', padding: '0.8rem', textAlign: 'left' }}>{field.toUpperCase()}</th>
                  <td style={{ border: '1px solid #dce1d9', padding: '0.8rem' }}>
                    {editingField === field ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(event) => setEditValue(event.target.value)}
                          style={{ flex: '1', minWidth: '180px', padding: '0.45rem 0.6rem' }}
                        />
                        <button type="button" onClick={handleSaveEdit}>Save</button>
                        <button type="button" onClick={handleCancelEdit}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                        <span>{getFieldValue(field)}</span>
                        {editableFields.includes(field) && (
                          <button type="button" onClick={() => handleEditStart(field)}>Edit</button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </section>
    </main>
  );
}

export default Profile;