const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Create an order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      userId: req.user.id
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get an order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Check if user owns the order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update an order
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Check if user owns the order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this order' });
    }
    
    order = await Order.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, userId: req.user.id }, 
      { new: true }
    );
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete an order
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Check if user owns the order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this order' });
    }
    
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;