const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// GET /api/budgets?month=2026-10
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const budgets = await Budget.find({ month }).sort({ category: 1 });
    res.json(budgets);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/budgets → save or update (upsert on category+month)
router.post('/', async (req, res) => {
  try {
    const { category, amount, month } = req.body;
    if (!category || amount == null || !month)
      return res.status(400).json({ message: 'category, amount and month are required' });
    const budget = await Budget.findOneAndUpdate(
      { category, month },
      { category, amount, month },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(budget);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/budgets/:id
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body,
      { new: true, runValidators: true });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/budgets/:id
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;