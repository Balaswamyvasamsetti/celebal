const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./database');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('./crud');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Input validation middleware
const validateUserInput = (req, res, next) => {
  const { name, email, age } = req.body;
  
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Name is required and must be at least 2 characters long' 
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Valid email address is required' 
      });
    }
    
    if (!age || isNaN(age) || age < 1 || age > 120) {
      return res.status(400).json({ 
        error: 'Age must be a number between 1 and 120' 
      });
    }
  }
  
  next();
};

// Error handling middleware
const handleAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/users', validateUserInput, handleAsync(async (req, res) => {
  const userData = {
    name: req.body.name.trim(),
    email: req.body.email.toLowerCase().trim(),
    age: parseInt(req.body.age)
  };
  
  const user = await createUser(userData);
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user
  });
}));

app.get('/users', handleAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const users = await getAllUsers();
  const paginatedUsers = users.slice(skip, skip + limit);
  
  res.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(users.length / limit),
      totalUsers: users.length,
      hasNext: skip + limit < users.length,
      hasPrev: page > 1
    }
  });
}));

app.get('/users/:id', handleAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid user ID format' 
    });
  }
  
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).json({ 
      success: false,
      error: 'User not found' 
    });
  }
  
  res.json({
    success: true,
    data: user
  });
}));

app.put('/users/:id', validateUserInput, handleAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid user ID format' 
    });
  }
  
  const userData = {
    name: req.body.name.trim(),
    email: req.body.email.toLowerCase().trim(),
    age: parseInt(req.body.age)
  };
  
  const user = await updateUser(id, userData);
  if (!user) {
    return res.status(404).json({ 
      success: false,
      error: 'User not found' 
    });
  }
  
  res.json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
}));

app.delete('/users/:id', handleAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid user ID format' 
    });
  }
  
  const user = await deleteUser(id);
  if (!user) {
    return res.status(404).json({ 
      success: false,
      error: 'User not found' 
    });
  }
  
  res.json({
    success: true,
    message: 'User deleted successfully',
    data: user
  });
}));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.message
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log('\n🚀 Server Started Successfully!');
      console.log(`📍 Server running on: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('\n📋 Available API Endpoints:');
      console.log('   GET    /api/health     - Health check');
      console.log('   POST   /users         - Create user');
      console.log('   GET    /users         - Get all users (with pagination)');
      console.log('   GET    /users/:id     - Get user by ID');
      console.log('   PUT    /users/:id     - Update user');
      console.log('   DELETE /users/:id     - Delete user');
      console.log('\n✅ Ready to accept requests!\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();