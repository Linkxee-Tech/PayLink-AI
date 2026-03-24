const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: { 
    type: String, 
    required: true,
    enum: ['login', 'verification', 'claim', 'payment', 'admin_activity', 'registration']
  },
  userType: { type: String, enum: ['citizen', 'hospital', 'admin'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel' },
  userModel: { type: String, enum: ['Citizen', 'Hospital'] },
  details: { type: String },
  ip: { type: String },
  reference: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
