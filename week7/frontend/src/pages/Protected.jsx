import { useState, useEffect } from 'react';
import axios from 'axios';

const Protected = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    stock: ''
  });

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

  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('/api/products', {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      });
      setProducts([...products, res.data]);
      setProductForm({ name: '', price: '', category: '', stock: '' });
      setError(null);
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
        setError(null);
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(err.response?.data?.message || 'Failed to delete product');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && products.length === 0) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="container">
      <h1>Protected Route</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="card-header">
          <h2>Create New Product</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleProductSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={productForm.name}
                onChange={handleProductChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                value={productForm.price}
                onChange={handleProductChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={productForm.category}
                onChange={handleProductChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={productForm.stock}
                onChange={handleProductChange}
                required
              />
            </div>
            <button type="submit" className="btn">Create Product</button>
          </form>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2>Your Products</h2>
        </div>
        <div className="card-body">
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className="items-list">
              {products.map(product => (
                <div key={product._id} className="item-card">
                  <h3>{product.name}</h3>
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Stock:</strong> {product.stock}</p>
                  <button 
                    onClick={() => deleteProduct(product._id)} 
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2>Your Orders</h2>
        </div>
        <div className="card-body">
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <div className="items-list">
              {orders.map(order => (
                <div key={order._id} className="item-card">
                  <h3>Order #{order._id.substring(0, 6)}</h3>
                  <p><strong>Total:</strong> ${order.total}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Items:</strong> {Array.isArray(order.items) ? order.items.join(', ') : order.items}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Protected;