const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Citizen = require('../models/Citizen');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');

const { sendOTP } = require('../utils/emailService');
const interswitch = require('../utils/interswitchService');
const { createLog } = require('../utils/logger');

// @desc    Submit emergency treatment claim
// @route   POST /api/claims/submit
// @access  Private (Hospital)
router.post('/submit', protect, async (req, res) => {
  try {
    const { citizenId, amount, diagnosis, treatmentDetails } = req.body;
    const hospital = req.hospital;

    // Check for "emergency window" fraud prevention (One claim per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentClaim = await Claim.findOne({
      citizen: citizenId,
      createdAt: { $gt: oneHourAgo },
      status: { $ne: 'declined' }
    });

    if (recentClaim) {
      return res.status(429).json({ 
        success: false, 
        message: 'Security Alert: Only one emergency claim allowed per 1-hour window to prevent fraud.' 
      });
    }

    // Check citizen balance
    const citizen = await Citizen.findById(citizenId);
    if (!citizen) {
      return res.status(404).json({ success: false, message: 'Citizen not found' });
    }

    if (citizen.walletBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient insurance balance' });
    }

    // --- INTERSWITCH REAL-TIME SETTLEMENT ---
    const iswReference = `CLM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const settlement = await interswitch.initiateTransfer({
      amount,
      accountNumber: hospital.accountNumber,
      bankCode: hospital.bankCode,
      reference: iswReference
    });

    if (!settlement.success) {
      return res.status(502).json({ success: false, message: 'Payment Settlement Error: Could not process disbursement via Interswitch.' });
    }

    // Generate Payment Notification Token
    const paymentToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Create Claim
    const claim = await Claim.create({
      citizen: citizenId,
      hospital: hospital._id,
      amount,
      diagnosis,
      treatmentDetails,
      status: 'paid',
      reference: iswReference
    });

    // Deduct from citizen wallet
    citizen.walletBalance -= amount;
    await citizen.save();

    // Send Payment Success Email
    await sendOTP(citizen.email, paymentToken, 'Payment Confirmation');

    // Create Transaction Log
    const transactionRef = `TXN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    await Transaction.create({
      type: 'debit',
      amount,
      citizen: citizenId,
      hospital: hospital._id,
      claim: claim._id,
      status: 'completed',
      reference: transactionRef
    });

    // Log Activity
    await createLog({
      action: 'claim',
      userType: 'hospital',
      userId: hospital._id,
      userModel: 'Hospital',
      details: `Claim ${iswReference} submitted for ₦${amount}.`,
      reference: transactionRef
    });

    // Log Activity
    await createLog({
      action: 'claim',
      userType: 'hospital',
      userId: hospital._id,
      userModel: 'Hospital',
      details: `Claim ${iswReference} settled via Interswitch for ₦${amount}.`,
      reference: iswReference
    });

    res.status(201).json({
      success: true,
      data: claim,
      newBalance: citizen.walletBalance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get hospital claim history
// @route   GET /api/claims/hospital
// @access  Private (Hospital)
router.get('/hospital', protect, async (req, res) => {
  try {
    const claims = await Claim.find({ hospital: req.hospital._id })
      .populate('citizen', 'fullName umhn')
      .sort('-createdAt');

    res.json({ success: true, data: claims });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
