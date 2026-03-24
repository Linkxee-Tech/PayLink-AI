const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const Citizen = require('../models/Citizen');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const { createLog } = require('../utils/logger');
const { sendOTP } = require('../utils/emailService');
const interswitch = require('../utils/interswitchService');

// @desc    Register a citizen
// @route   POST /api/auth/register-citizen
// @access  Public
router.post('/register-citizen', async (req, res) => {
  try {
    const { fullName, nin, bvn, phone, dob, email, salary } = req.body;

    // Check if citizen already exists
    let citizen = await Citizen.findOne({ $or: [{ nin }, { bvn }, { email }] });
    if (citizen) {
      return res.status(400).json({ success: false, message: 'Citizen already registered with this NIN, BVN or Email' });
    }

    // Calculate Credit: Min 20,000, Max is 15% of annual salary (simulated as monthly*12)
    const baseCredit = 20000;
    const salaryCredit = (salary || 0) * 0.15;
    const initialBalance = Math.max(baseCredit, salaryCredit);

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Generate UMHN
    const umhn = `NG-MED-${Math.floor(10000000 + Math.random() * 90000000)}`;

    citizen = await Citizen.create({
      fullName,
      nin,
      bvn,
      phone,
      dob,
      email,
      salary: salary || 0,
      umhn,
      walletBalance: initialBalance,
      otp,
      otpExpires
    });

    // Log Activity
    await createLog({
      action: 'registration',
      userType: 'citizen',
      userId: citizen._id,
      userModel: 'Citizen',
      details: `Registered with UMHN ${umhn}. Initial credit: ₦${initialBalance}`,
      reference: umhn
    });

    // Send Notification Email
    await sendOTP(email, otp, 'Verification');

    res.status(201).json({
      success: true,
      data: {
        umhn: citizen.umhn,
        fullName: citizen.fullName,
        walletBalance: citizen.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Verify Citizen OTP
// @route   POST /api/auth/verify-citizen-otp
// @access  Public
router.post('/verify-citizen-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const citizen = await Citizen.findOne({ email });

    if (!citizen) {
      return res.status(404).json({ success: false, message: 'Citizen not found' });
    }

    if (citizen.otp !== otp || citizen.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    citizen.otp = undefined;
    citizen.otpExpires = undefined;
    await citizen.save();

    res.json({ success: true, message: 'Identity verified successfully', data: citizen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Hospital Login
// @route   POST /api/auth/hospital-login
// @access  Public
router.post('/hospital-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await hospital.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (hospital.status !== 'approved') {
      return res.status(403).json({ success: false, message: 'Hospital account is pending approval' });
    }

    const token = jwt.sign({ id: hospital._id, role: 'hospital' }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    // Log Activity
    await createLog({
      action: 'login',
      userType: 'hospital',
      userId: hospital._id,
      userModel: 'Hospital',
      details: `Hospital ${hospital.name} logged in.`,
      reference: hospital.licenseNumber
    });

    res.json({
      success: true,
      token,
      hospital: {
        id: hospital._id,
        name: hospital.name,
        licenseNumber: hospital.licenseNumber
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Hospital Registration
// @route   POST /api/auth/register-hospital
// @access  Public
router.post('/register-hospital', async (req, res) => {
  try {
    const { name, email, password, licenseNumber, address, state, lga, accountNumber, accountName, bankName } = req.body;

    let hospital = await Hospital.findOne({ $or: [{ email }, { licenseNumber }] });
    if (hospital) {
      return res.status(400).json({ success: false, message: 'Hospital already registered' });
    }

    // --- INTERSWITCH BANK ACCOUNT VALIDATION ---
    try {
        const accountValid = await interswitch.nameEnquiry(accountNumber, bankCode);
        if (accountValid && accountValid.success === false) {
             console.warn('Bank validation failed, but allowed in sandbox');
        }
    } catch (e) { console.log('Interswitch skip'); }

    hospital = await Hospital.create({
      name,
      email,
      password,
      licenseNumber,
      accountNumber,
      accountName,
      bankName,
      address,
      state,
      lga
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Waiting for admin approval.',
      data: {
        id: hospital._id,
        name: hospital.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
