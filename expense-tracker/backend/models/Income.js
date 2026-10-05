const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    title:  { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    date:  { type: Date, required: true },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Income || mongoose.model('Income', incomeSchema);
