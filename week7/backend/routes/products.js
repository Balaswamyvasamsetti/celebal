const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// @route   POST /api/products
// @desc    Create a product
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      userId: req.user.id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get a product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Check if user owns the product
    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }
    
    product = await Product.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, userId: req.user.id }, 
      { new: true }
    );
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Check if user owns the product
    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;