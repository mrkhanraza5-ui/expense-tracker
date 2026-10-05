const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');
const Income = require('../models/Income');

router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [exp] = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const [inc] = await Income.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const [expMonth] = await Expense.aggregate([
      { $match: { date: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const [incMonth] = await Income.aggregate([
      { $match: { date: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const byCategory = await Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);
    const byCategoryThisMonth = await Expense.aggregate([
      { $match: { date: { $gte: monthStart } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);

    const expenseByMonth = await Expense.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$date' } }, total: { $sum: '$amount' } } },
    ]);
    const incomeByMonth = await Income.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$date' } }, total: { $sum: '$amount' } } },
    ]);
    const map = {};
    expenseByMonth.forEach((m) => { map[m._id] = { _id: m._id, expense: m.total, income: 0 }; });
    incomeByMonth.forEach((m) => {
      if (map[m._id]) map[m._id].income = m.total;
      else map[m._id] = { _id: m._id, expense: 0, income: m.total };
    });
    const byMonth = Object.values(map).sort((a, b) => a._id.localeCompare(b._id)).slice(-6);

    res.json({
      totalExpense: exp?.total || 0,
      totalIncome: inc?.total || 0,
      balance: (inc?.total || 0) - (exp?.total || 0),
      expenseCount: exp?.count || 0,
      incomeCount: inc?.count || 0,
      thisMonthExpense: expMonth?.total || 0,
      thisMonthIncome: incMonth?.total || 0,
      byCategory, byCategoryThisMonth, byMonth,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
