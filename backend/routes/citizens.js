const express = require('express');
const router = express.Router();
const Citizen = require('../models/Citizen');

const { createLog } = require('../utils/logger');
const { sendOTP } = require('../utils/emailService');

// @desc    Get citizen by UMHN (For hospital lookup)
// @route   GET /api/citizens/verify/:umhn
// @access  Hospital Only (Simplified for MVP)
router.get('/verify/:umhn', async (req, res) => {
  try {
    const { umhn } = req.params;
    const citizen = await Citizen.findOne({ umhn }).select('-otp -otpExpires -nin -bvn');
    
    if (!citizen) {
      return res.status(404).json({ success: false, message: 'Citizen not found' });
    }

    // Log Verification
    await createLog({
      action: 'verification',
      userType: 'hospital',
      details: `Citizen ${citizen.fullName} verified by a hospital.`,
      reference: umhn
    });

    res.json({ success: true, data: citizen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get citizen profile with history
// @route   GET /api/citizens/profile/:email
// @access  Public (Simplified for MVP)
router.get('/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const citizen = await Citizen.findOne({ email });
    
    if (!citizen) {
      return res.status(404).json({ success: false, message: 'Citizen not found' });
    }

    res.json({ success: true, data: citizen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Repay insurance debt
// @route   POST /api/citizens/repay
// @access  Public (Simplified for MVP)
router.post('/repay', async (req, res) => {
  try {
    const { email, amount } = req.body;
    const citizen = await Citizen.findOne({ email });
    
    if (!citizen) {
      return res.status(404).json({ success: false, message: 'Citizen not found' });
    }

    citizen.walletBalance += Number(amount);
    await citizen.save();

    // Create Transaction Log
    const reference = `RPY-${Math.floor(100000 + Math.random() * 900000)}`;
    await Transaction.create({
      type: 'credit',
      amount,
      citizen: citizen._id,
      status: 'completed',
      reference
    });

    // Send Repayment Confirmation
    const repayToken = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOTP(citizen.email, repayToken, 'Repayment Confirmation');

    // Log Activity
    await createLog({
      action: 'payment',
      userType: 'citizen',
      userId: citizen._id,
      userModel: 'Citizen',
      details: `Repayment of ₦${amount} received.`,
      reference
    });

    res.json({ success: true, message: 'Repayment successful', newBalance: citizen.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
