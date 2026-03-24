const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['debit', 'credit'], required: true },
  amount: { type: Number, required: true },
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' },
  status: { type: String, default: 'completed' },
  reference: { type: String, unique: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
