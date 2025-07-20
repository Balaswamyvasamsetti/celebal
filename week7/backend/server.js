require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Week6 compatibility routes
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// USERS CRUD (Week6 compatibility)
app.post('/users', async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password || 'default123' // Default password for compatibility
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PRODUCTS CRUD (Week6 compatibility)
app.post('/products', async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      userId: req.body.userId || '64f5b3e5d3a5c5e8f0e8b0a0' // Default userId for compatibility
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ORDERS CRUD (Week6 compatibility)
app.post('/orders', async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      userId: req.body.userId || '64f5b3e5d3a5c5e8f0e8b0a0' // Default userId for compatibility
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public routes for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the JWT Auth API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`\n🌐 API URL: http://localhost:${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log('Authentication:');
  console.log('  POST /api/auth/register - Register a new user');
  console.log('  POST /api/auth/login - Login and get token');
  console.log('  GET /api/auth/user - Get user data (protected)');
  console.log('Products:');
  console.log('  GET /api/products - Get all products');
  console.log('  GET /api/products/:id - Get product by ID');
  console.log('  POST /api/products - Create product (protected)');
  console.log('  PUT /api/products/:id - Update product (protected)');
  console.log('  DELETE /api/products/:id - Delete product (protected)');
  console.log('Orders:');
  console.log('  GET /api/orders - Get user orders (protected)');
  console.log('  GET /api/orders/:id - Get order by ID (protected)');
  console.log('  POST /api/orders - Create order (protected)');
  console.log('  PUT /api/orders/:id - Update order (protected)');
  console.log('  DELETE /api/orders/:id - Delete order (protected)');
  console.log('\nWeek6 Compatibility Endpoints:');
  console.log('  GET /users - Get all users');
  console.log('  GET /users/:id - Get user by ID');
  console.log('  POST /users - Create user');
  console.log('  PUT /users/:id - Update user');
  console.log('  DELETE /users/:id - Delete user');
  console.log('  GET /products - Get all products');
  console.log('  GET /products/:id - Get product by ID');
  console.log('  POST /products - Create product');
  console.log('  PUT /products/:id - Update product');
  console.log('  DELETE /products/:id - Delete product');
  console.log('  GET /orders - Get all orders');
  console.log('  GET /orders/:id - Get order by ID');
  console.log('  POST /orders - Create order');
  console.log('  PUT /orders/:id - Update order');
  console.log('  DELETE /orders/:id - Delete order');
});