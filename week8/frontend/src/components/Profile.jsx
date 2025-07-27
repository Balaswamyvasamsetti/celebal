import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ user, token }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const { name, email } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('Profile update feature is not implemented yet');
  };

  return (
    <div className="card">
      <h2>My Profile</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        {user && user.profileImage ? (
          <img 
            src={`/uploads/${user.profileImage}`} 
            alt="Profile" 
            style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #2563eb',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }} 
          />
        ) : (
          <div style={{ 
            width: '150px', 
            height: '150px', 
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: '#9ca3af',
            fontWeight: 'bold'
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <h3 style={{ marginTop: '1rem', color: '#2563eb' }}>{name}</h3>
        <p style={{ color: '#6b7280' }}>{email}</p>
      </div>
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;