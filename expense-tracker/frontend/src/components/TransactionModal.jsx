import { useEffect, useState } from 'react';
import { getCategories, updateExpense, updateIncome } from '../services/api';

export default function TransactionModal({ item, onClose, onSaved }) {
  const kind = item.kind; // 'expense' | 'income'
  const [cats, setCats] = useState([]);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: item.title, amount: item.amount, category: item.category,
    date: item.date.slice(0, 10), notes: item.notes || '',
    paymentMethod: item.paymentMethod || 'UPI',
  });

  useEffect(() => {
    getCategories().then((r) => setCats(r.data.filter((c) => c.type === kind)));
  }, [kind]);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || form.amount === '' || !form.category) {
      setErr('Description, amount and category are required'); return;
    }
    setSaving(true); setErr('');
    try {
      const payload = { ...form, title: form.title.trim(), amount: Number(form.amount) };
      if (kind === 'income') delete payload.paymentMethod;
      await (kind === 'income' ? updateIncome(item._id, payload)
                               : updateExpense(item._id, payload));
      onSaved();
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <h3>Edit {kind === 'income' ? 'income' : 'expense'}</h3>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        {err && <div className="banner">{err}</div>}

        <div className="fgrid">
          <div><label>Amount (₹) <i>*</i></label>
            <input name="amount" type="number" min="0" step="0.01"
                   value={form.amount} onChange={change} required /></div>
          <div><label>{kind === 'income' ? 'Source' : 'Category'} <i>*</i></label>
            <select name="category" value={form.category} onChange={change} required>
              {cats.map((c) => <option key={c._id}>{c.name}</option>)}
            </select></div>
          <div><label>Description <i>*</i></label>
            <input name="title" value={form.title} onChange={change} required /></div>
          <div><label>Date <i>*</i></label>
            <input name="date" type="date" value={form.date} onChange={change} required /></div>
          {kind === 'expense' && (
            <div><label>Payment method</label>
              <select name="paymentMethod" value={form.paymentMethod} onChange={change}>
                {['UPI', 'Cash', 'Card', 'Net Banking', 'Other'].map((m) => <option key={m}>{m}</option>)}
              </select></div>
          )}
        </div>
        <label>Notes</label>
        <textarea name="notes" rows="2" value={form.notes} onChange={change} placeholder="Optional details" />

        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}