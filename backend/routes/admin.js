const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const Claim = require('../models/Claim');

const { createLog } = require('../utils/logger');

// @desc    Get all pending hospitals
// @route   GET /api/admin/pending-hospitals
// @access  Admin (Simplified for MVP)
router.get('/pending-hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find({ status: 'pending' });
    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Approve/Reject hospital
// @route   PUT /api/admin/hospitals/:id
// @access  Admin
router.put('/hospitals/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    // Log Admin Activity
    await createLog({
      action: 'admin_activity',
      userType: 'admin',
      details: `Hospital ${hospital.name} ${status}.`,
      reference: hospital.licenseNumber
    });

    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const totalClaims = await Claim.countDocuments();
    const totalPayout = await Claim.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
    const pendingHospitals = await Hospital.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      data: {
        totalClaims,
        totalPayout: totalPayout.length > 0 ? totalPayout[0].total : 0,
        pendingHospitals
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all audit logs
// @route   GET /api/admin/logs
// @access  Admin
router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort('-createdAt').limit(50);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
