import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, addExpense } from '../services/api';

const METHODS = ['UPI', 'Cash', 'Card', 'Net Banking', 'Other'];
const today = () => new Date().toISOString().slice(0, 10);

export default function AddExpense() {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    amount: '', category: '', title: '', date: today(), paymentMethod: 'UPI', notes: '',
  });

  useEffect(() => {
    getCategories().then((r) => setCats(r.data.filter((c) => c.type === 'expense')));
  }, []);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.title.trim()) {
      setErr('Please fill all required fields.'); return;
    }
    setSaving(true); setErr('');
    try {
      await addExpense({ ...form, title: form.title.trim(), amount: Number(form.amount) });
      navigate('/transactions');
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  return (
    <div className="page">
      <p className="page-sub">Record accurate details to keep your reports useful.</p>
      <form className="panel form-panel" onSubmit={submit}>
        {err && <div className="banner">{err}</div>}
        <div className="fgrid">
          <div><label>Amount (₹) <i>*</i></label>
            <input name="amount" type="number" min="0" step="0.01" placeholder="0.00"
                   value={form.amount} onChange={change} required /></div>
          <div><label>Category <i>*</i></label>
            <select name="category" value={form.category} onChange={change} required>
              <option value="">Select one</option>
              {cats.map((c) => <option key={c._id}>{c.name}</option>)}
            </select></div>
          <div><label>Description <i>*</i></label>
            <input name="title" placeholder="Lunch with friends"
                   value={form.title} onChange={change} required /></div>
          <div><label>Date <i>*</i></label>
            <input name="date" type="date" value={form.date} onChange={change} required /></div>
          <div><label>Payment method</label>
            <select name="paymentMethod" value={form.paymentMethod} onChange={change}>
              {METHODS.map((m) => <option key={m}>{m}</option>)}
            </select></div>
        </div>
        <label>Notes</label>
        <textarea name="notes" rows="3" placeholder="Optional details"
                  value={form.notes} onChange={change} />
        <button className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Add expense'}
        </button>
      </form>
    </div>
  );
}