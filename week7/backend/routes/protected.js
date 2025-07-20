const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   GET /api/protected
// @desc    Test protected route
// @access  Private
router.get('/', auth, (req, res) => {
  res.json({ 
    message: 'Protected route accessed successfully',
    user: {
      id: req.user.id
    }
  });
});

module.exports = router;