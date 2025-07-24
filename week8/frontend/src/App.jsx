import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [apiStatus, setApiStatus] = useState('checking');

  // Check API connection on startup
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const res = await axios.get('/api/health');
        if (res.data.status === 'ok') {
          setApiStatus('connected');
        } else {
          setApiStatus('error');
        }
      } catch (err) {
        setApiStatus('error');
      }
    };
    
    checkApiStatus();
  }, []);

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.get('/api/auth/me', config);
      setUser(res.data.data);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="container">
        <header>
          <h1>Advanced Express App</h1>
          {apiStatus === 'error' && (
            <div className="alert alert-danger">
              API connection error. Please make sure the backend server is running on port 5000.
            </div>
          )}
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/upload">File Upload</Link>
                  </li>
                  <li>
                    <button onClick={logout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={
            <div className="card">
              <h2>Welcome to Advanced Express App</h2>
              <p>This application demonstrates advanced Express.js features:</p>
              <ul style={{ marginLeft: '1.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
                <li>File uploads with Multer</li>
                <li>Advanced error handling</li>
                <li>Authentication with JWT</li>
                <li>MongoDB integration</li>
              </ul>
              <p>API Status: {apiStatus === 'connected' ? '✅ Connected' : apiStatus === 'checking' ? '⏳ Checking...' : '❌ Error'}</p>
            </div>
          } />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/register" element={<Register login={login} />} />
          <Route path="/profile" element={
            isAuthenticated ? <Profile user={user} token={token} /> : <Login login={login} />
          } />
          <Route path="/upload" element={
            isAuthenticated ? <FileUpload token={token} /> : <Login login={login} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;