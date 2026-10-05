const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

const DEFAULTS = {
  expense: ['Bills', 'Education', 'Entertainment', 'Food', 'Health', 'Other', 'Shopping', 'Travel'],
  income:  ['Business', 'Freelance', 'Other', 'Pocket Money', 'Salary', 'Scholarship'],
};

// GET /api/categories → seeds defaults if collection empty
router.get('/', async (req, res) => {
  try {
    if ((await Category.countDocuments()) === 0) {
      await Category.insertMany([
        ...DEFAULTS.expense.map((n) => ({ name: n, type: 'expense' })),
        ...DEFAULTS.income.map((n) => ({ name: n, type: 'income' })),
      ]);
    }
    const categories = await Category.find().sort({ type: 1, name: 1 });
    res.json(categories);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name?.trim() || !['expense', 'income'].includes(type))
      return res.status(400).json({ message: 'Valid name and type required' });
    if (await Category.findOne({ name: name.trim(), type }))
      return res.status(400).json({ message: 'Category already exists' });
    const category = await Category.create({ name: name.trim(), type });
    res.status(201).json(category);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Deleted (existing transactions keep their old category)' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;