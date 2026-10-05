require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/incomes');
const budgetRoutes = require('./routes/budgets');
const categoryRoutes = require('./routes/categories');
const summaryRoutes = require('./routes/Summary');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/summary', summaryRoutes);
app.get('/', (req, res) => res.json({ message: 'ExpenseWise API running 🚀' }));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB error:', err.message));
