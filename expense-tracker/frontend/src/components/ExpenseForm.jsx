import { useState, useEffect } from 'react';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];
const EMPTY = {
  title: '', amount: '', category: 'Food',
  date: new Date().toISOString().slice(0, 10), notes: '',
};

function ExpenseForm({ onSubmit, editing, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        amount: editing.amount,
        category: editing.category,
        date: editing.date.slice(0, 10),
        notes: editing.notes || '',
      });
    }
  }, [editing]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, title: form.title.trim(), amount: Number(form.amount) });
      setForm(EMPTY);
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card expense-form" onSubmit={handleSubmit}>
      <h2>{editing ? '✏️ Edit Expense' : '➕ Add New Expense'}</h2>

      <label>Title</label>
      <input name="title" value={form.title} onChange={handleChange}
             placeholder="e.g. Lunch at canteen" required />

      <div className="row">
        <div>
          <label>Amount (₹)</label>
          <input name="amount" type="number" min="0" step="0.01" value={form.amount}
                 onChange={handleChange} placeholder="0.00" required />
        </div>
        <div>
          <label>Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
        </div>
      </div>

      <label>Category</label>
      <select name="category" value={form.category} onChange={handleChange}>
        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>

      <label>Notes (optional)</label>
      <input name="notes" value={form.notes} onChange={handleChange} placeholder="Any details..." />

      <div className="form-buttons">
        <button type="submit" disabled={submitting}>{editing ? 'Update' : 'Add Expense'}</button>
        {editing && (
          <button type="button" className="secondary"
                  onClick={() => { onCancelEdit(); setForm(EMPTY); }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ExpenseForm;