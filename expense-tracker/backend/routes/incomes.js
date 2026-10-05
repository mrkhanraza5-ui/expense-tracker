const express = require('express');
const router = express.Router();
const Income = require('../models/Income');

// GET /api/incomes?category=Salary&search=salary
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const incomes = await Income.find(filter).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/incomes
router.post('/', async (req, res) => {
  try {
    const income = await Income.create(req.body);
    res.status(201).json(income);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/incomes/:id
router.put('/:id', async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.json(income);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/incomes/:id
router.delete('/:id', async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;