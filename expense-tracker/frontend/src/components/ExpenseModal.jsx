import { useState } from 'react';

const EXPENSE_CATS = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];
const INCOME_CATS = ['Salary', 'Freelance', 'Business', 'Gift', 'Investment', 'Refund', 'Other'];

export default function ExpenseModal({ editing, initialType = 'expense', onSave, onClose }) {
  const [type, setType] = useState(editing ? editing.type : initialType);
  const [form, setForm] = useState(() =>
    editing
      ? {
          title: editing.title,
          amount: editing.amount,
          category: editing.category,
          date: editing.date.slice(0, 10),
          notes: editing.notes || '',
        }
      : {
          title: '',
          amount: '',
          category: initialType === 'income' ? 'Salary' : 'Food',
          date: new Date().toISOString().slice(0, 10),
          notes: '',
        }
  );
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const switchType = (t) => {
    setType(t);
    const cats = t === 'income' ? INCOME_CATS : EXPENSE_CATS;
    setForm(f => ({ ...f, category: cats.includes(f.category) ? f.category : cats[0] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || form.amount === '') { setErr('Title and amount are required'); return; }
    setSaving(true); setErr('');
    try {
      await onSave({ ...form, title: form.title.trim(), amount: Number(form.amount), type });
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const cats = type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <h3>{editing
            ? (type === 'income' ? '✏️ Edit Income' : '✏️ Edit Expense')
            : (type === 'income' ? '＋ New Income' : '＋ New Expense')}</h3>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>

        {!editing && (
          <div className="type-toggle">
            <button type="button" className={`seg seg-exp ${type === 'expense' ? 'on' : ''}`}
                    onClick={() => switchType('expense')}>↓ Expense</button>
            <button type="button" className={`seg seg-inc ${type === 'income' ? 'on' : ''}`}
                    onClick={() => switchType('income')}>↑ Income</button>
          </div>
        )}

        {err && <div className="form-err">{err}</div>}

        <label>{type === 'income' ? 'Source' : 'Title'}</label>
        <input name="title" value={form.title} onChange={change}
               placeholder={type === 'income' ? 'e.g. October salary' : 'e.g. Lunch at canteen'} autoFocus />

        <div className="two">
          <div>
            <label>Amount (₹)</label>
            <input name="amount" type="number" min="0" step="0.01"
                   value={form.amount} onChange={change} placeholder="0.00" />
          </div>
          <div>
            <label>Date</label>
            <input name="date" type="date" value={form.date} onChange={change} />
          </div>
        </div>

        <label>Category</label>
        <select name="category" value={form.category} onChange={change}>
          {cats.map(c => <option key={c}>{c}</option>)}
        </select>

        <label>Notes (optional)</label>
        <input name="notes" value={form.notes} onChange={change} placeholder="Any details..." />

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : (type === 'income' ? 'Add Income' : 'Add Expense')}
          </button>
        </div>
      </form>
    </div>
  );
}