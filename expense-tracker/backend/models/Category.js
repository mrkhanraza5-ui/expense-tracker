const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['expense', 'income'], required: true },
  },
  { timestamps: true }
);
categorySchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
