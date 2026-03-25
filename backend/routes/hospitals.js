const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all hospitals (Admin only)
// @route   GET /api/hospitals
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find({}).sort('-createdAt');
    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update hospital status
// @route   PUT /api/hospitals/:id/status
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
