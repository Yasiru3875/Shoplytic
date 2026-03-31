const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId:         { type: String, required: true },
    userId:          { type: String, required: true },
    amount:          { type: Number, required: true, min: 0 },
    method:          { type: String, enum: ['card', 'cash', 'online'], required: true },
    status:          { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionRef:  { type: String, default: () => 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 10000) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
