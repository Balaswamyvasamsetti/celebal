import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>JWT Authentication Demo</h1>
        </div>
        <div className="card-body">
          <p>This is a demonstration of JWT authentication with React and Node.js.</p>
          <p>Features include:</p>
          <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
            <li>User registration and login</li>
            <li>JWT token-based authentication</li>
            <li>Protected routes</li>
            <li>Password hashing with bcrypt</li>
            <li>CRUD operations for products and orders</li>
          </ul>
        </div>
        <div className="card-footer" style={{ marginTop: '2rem' }}>
          {user ? (
            <div>
              <p>You are logged in as <strong>{user.name}</strong></p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Link to="/dashboard" className="btn">Go to Dashboard</Link>
                <Link to="/protected" className="btn btn-secondary">Access Protected Route</Link>
              </div>
            </div>
          ) : (
            <div>
              <p>Please login or register to access protected routes.</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Link to="/login" className="btn">Login</Link>
                <Link to="/register" className="btn btn-secondary">Register</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;