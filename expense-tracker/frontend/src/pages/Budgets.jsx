import { useEffect, useState } from 'react';
import { getBudgets, saveBudget, deleteBudget, getCategories, getSummary } from '../services/api';

const now = new Date();
const MONTH = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
const MONTH_NAME = now.toLocaleString('en', { month: 'long', year: 'numeric' });
const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [cats, setCats] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState({ category: '', amount: '' });
  const [err, setErr] = useState('');

  const load = () => Promise.all([getBudgets(MONTH), getCategories(), getSummary()])
    .then(([b, c, s]) => { setBudgets(b.data); setCats(c.data.filter((x) => x.type === 'expense')); setSummary(s.data); })
    .catch(() => setErr('⚠️ Cannot reach the API.'));

  useEffect(() => { load(); }, []);

  const spent = (cat) => summary?.byCategoryThisMonth?.find((c) => c._id === cat)?.total || 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.amount) { setErr('Select a category and enter an amount.'); return; }
    setErr('');
    await saveBudget({ category: form.category, amount: Number(form.amount), month: MONTH });
    setForm({ category: '', amount: '' });
    load();
  };

  const remove = async (id) => {
    if (window.confirm('Delete this budget?')) { await deleteBudget(id); load(); }
  };

  return (
    <div className="page">
      <div className="two-col">
        <form className="panel form-panel" onSubmit={submit}>
          <h3 className="panel-title">Set monthly budget</h3>
          <p className="muted small">{MONTH_NAME}</p>
          {err && <div className="banner">{err}</div>}
          <label>Category <i>*</i></label>
          <select value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            <option value="">Select category</option>
            {cats.map((c) => <option key={c._id}>{c.name}</option>)}
          </select>
          <label>Budget amount (₹) <i>*</i></label>
          <input type="number" min="0" value={form.amount} placeholder="e.g. 1000"
                 onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
          <button className="btn-primary wide">Save budget</button>
        </form>

        <section className="panel">
          <h3 className="panel-title">This month's budgets</h3>
          {budgets.length === 0 ? <p className="empty">No budgets set yet.</p> : (
            <div className="budget-grid">
              {budgets.map((b) => {
                const sp = spent(b.category);
                const pct = b.amount > 0 ? (sp / b.amount) * 100 : 0;
                const over = pct > 100;
                return (
                  <div className="budget-card" key={b._id}>
                    <div className="budget-top">
                      <strong>{b.category}</strong>
                      <span className={over ? 'over' : 'pct'}>
                        {over ? 'Budget exceeded' : `${Math.round(pct)}% used`}
                      </span>
                    </div>
                    <small className="muted">{inr(sp)} / {inr(b.amount)}</small>
                    <div className="bar-track">
                      <div className={`bar-fill ${over ? 'red' : ''}`}
                           style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                    <button className="del" title="Delete budget" onClick={() => remove(b._id)}>🗑️</button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}