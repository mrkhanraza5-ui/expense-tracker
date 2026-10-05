import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

// Expenses
export const getExpenses = (params) => api.get('/expenses', { params });
export const addExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Incomes
export const getIncomes = (params) => api.get('/incomes', { params });
export const addIncome = (data) => api.post('/incomes', data);
export const updateIncome = (id, data) => api.put(`/incomes/${id}`, data);
export const deleteIncome = (id) => api.delete(`/incomes/${id}`);

// Summary
export const getSummary = () => api.get('/summary');

// Budgets
export const getBudgets = (month) => api.get('/budgets', { params: { month } });
export const saveBudget = (data) => api.post('/budgets', data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

// Categories
export const getCategories = () => api.get('/categories');
export const addCategory = (data) => api.post('/categories', data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);