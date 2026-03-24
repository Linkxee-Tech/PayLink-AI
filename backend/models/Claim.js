const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  amount: { type: Number, required: true },
  diagnosis: { type: String, required: true },
  treatmentDetails: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'paid', 'declined'], 
    default: 'approved' 
  },
  reference: { type: String, unique: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
