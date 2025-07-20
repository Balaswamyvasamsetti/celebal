import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/orders')
        ]);
        
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return <div className="loading">Loading user data...</div>;
  }

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome, {user.name}!</p>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2>User Information</h2>
          </div>
          <div className="card-body">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2>Your Products</h2>
          </div>
          <div className="card-body">
            {products.length === 0 ? (
              <p>You haven't created any products yet.</p>
            ) : (
              <ul>
                {products.map(product => (
                  <li key={product._id}>
                    {product.name} - ${product.price} ({product.category})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2>Your Orders</h2>
          </div>
          <div className="card-body">
            {orders.length === 0 ? (
              <p>You haven't placed any orders yet.</p>
            ) : (
              <ul>
                {orders.map(order => (
                  <li key={order._id}>
                    Order #{order._id.substring(0, 6)} - ${order.total} ({order.status})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2>Protected Routes</h2>
          </div>
          <div className="card-body">
            <p>You can now access protected routes that require authentication.</p>
            <Link to="/protected" className="btn" style={{ marginTop: '1rem' }}>
              Access Protected Route
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;