import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [activeTab, setActiveTab] = useState('view');
  
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    age: ''
  });
  
  const [updateForm, setUpdateForm] = useState({
    id: '',
    name: '',
    email: '',
    age: ''
  });
  
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.age) {
      showNotification('Please fill all fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/users`, {
        name: createForm.name,
        email: createForm.email,
        age: parseInt(createForm.age)
      });
      setCreateForm({ name: '', email: '', age: '' });
      showNotification('User created successfully!');
      loadUsers();
    } catch (error) {
      showNotification('Failed to create user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!updateForm.id || !updateForm.name || !updateForm.email || !updateForm.age) {
      showNotification('Please fill all fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/users/${updateForm.id}`, {
        name: updateForm.name,
        email: updateForm.email,
        age: parseInt(updateForm.age)
      });
      setUpdateForm({ id: '', name: '', email: '', age: '' });
      showNotification('User updated successfully!');
      loadUsers();
    } catch (error) {
      showNotification('Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    if (!deleteId) {
      showNotification('Please enter user ID', 'error');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/users/${deleteId}`);
      setDeleteId('');
      showNotification('User deleted successfully!');
      loadUsers();
    } catch (error) {
      showNotification('Failed to delete user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillUpdateForm = (user) => {
    setUpdateForm({
      id: user._id,
      name: user.name || user.username || '',
      email: user.email || '',
      age: user.age || ''
    });
    setActiveTab('update');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>User Management Dashboard</h1>
        <p>Manage your users efficiently</p>
      </header>

      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <nav className="tab-navigation">
        <button 
          className={activeTab === 'view' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('view')}
        >
          View Users
        </button>
        <button 
          className={activeTab === 'create' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('create')}
        >
          Create User
        </button>
        <button 
          className={activeTab === 'update' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('update')}
        >
          Update User
        </button>
        <button 
          className={activeTab === 'delete' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('delete')}
        >
          Delete User
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'view' && (
          <section className="content-section">
            <div className="section-header">
              <h2>All Users</h2>
              <button onClick={loadUsers} className="btn btn-secondary" disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            
            {loading ? (
              <div className="loading">Loading users...</div>
            ) : (
              <div className="users-grid">
                {users.length === 0 ? (
                  <div className="empty-state">No users found</div>
                ) : (
                  users.map(user => (
                    <div key={user._id} className="user-card">
                      <div className="user-info">
                        <h3>{user.name || user.username}</h3>
                        <p className="user-email">{user.email}</p>
                        <p className="user-age">Age: {user.age || 'Not specified'}</p>
                        <p className="user-id">ID: {user._id}</p>
                      </div>
                      <div className="user-actions">
                        <button 
                          onClick={() => fillUpdateForm(user)}
                          className="btn btn-small btn-primary"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'create' && (
          <section className="content-section">
            <h2>Create New User</h2>
            <form onSubmit={handleCreateUser} className="user-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={createForm.age}
                  onChange={(e) => setCreateForm({...createForm, age: e.target.value})}
                  placeholder="Enter age"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </section>
        )}

        {activeTab === 'update' && (
          <section className="content-section">
            <h2>Update User</h2>
            <form onSubmit={handleUpdateUser} className="user-form">
              <div className="form-group">
                <label htmlFor="updateId">User ID</label>
                <input
                  id="updateId"
                  type="text"
                  value={updateForm.id}
                  onChange={(e) => setUpdateForm({...updateForm, id: e.target.value})}
                  placeholder="Enter user ID to update"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="updateName">Full Name</label>
                <input
                  id="updateName"
                  type="text"
                  value={updateForm.name}
                  onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})}
                  placeholder="Enter new name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="updateEmail">Email Address</label>
                <input
                  id="updateEmail"
                  type="email"
                  value={updateForm.email}
                  onChange={(e) => setUpdateForm({...updateForm, email: e.target.value})}
                  placeholder="Enter new email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="updateAge">Age</label>
                <input
                  id="updateAge"
                  type="number"
                  min="1"
                  max="120"
                  value={updateForm.age}
                  onChange={(e) => setUpdateForm({...updateForm, age: e.target.value})}
                  placeholder="Enter new age"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-warning" disabled={loading}>
                {loading ? 'Updating...' : 'Update User'}
              </button>
            </form>
          </section>
        )}

        {activeTab === 'delete' && (
          <section className="content-section">
            <h2>Delete User</h2>
            <div className="warning-message">
              ⚠️ This action cannot be undone. Please be careful.
            </div>
            <form onSubmit={handleDeleteUser} className="user-form">
              <div className="form-group">
                <label htmlFor="deleteId">User ID</label>
                <input
                  id="deleteId"
                  type="text"
                  value={deleteId}
                  onChange={(e) => setDeleteId(e.target.value)}
                  placeholder="Enter user ID to delete"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-danger" disabled={loading}>
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default UserManagement;