const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title:  { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    paymentMethod: {
      type: String, enum: ['UPI', 'Cash', 'Card', 'Net Banking', 'Other'],
      default: 'UPI',
    },
    date:  { type: Date, required: true },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
