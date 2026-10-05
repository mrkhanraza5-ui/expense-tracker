import { useEffect, useState } from 'react';
import { getCategories, addCategory, deleteCategory } from '../services/api';

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'expense' });
  const [err, setErr] = useState('');

  const load = () => getCategories().then((r) => setCats(r.data)).catch(() => setErr('⚠️ Cannot reach the API.'));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await addCategory({ name: form.name.trim(), type: form.type });
      setForm({ name: '', type: form.type }); setErr(''); load();
    } catch (e2) { setErr(e2.response?.data?.message || 'Could not add category.'); }
  };

  const remove = async (c) => {
    if (window.confirm(`Delete category “${c.name}”? Existing transactions keep their category.`)) {
      await deleteCategory(c._id); load();
    }
  };

  const exp = cats.filter((c) => c.type === 'expense');
  const inc = cats.filter((c) => c.type === 'income');

  return (
    <div className="page">
      <div className="cat-layout">
        <form className="panel form-panel" onSubmit={submit}>
          <h3 className="panel-title">New category</h3>
          {err && <div className="banner">{err}</div>}
          <label>Name <i>*</i></label>
          <input value={form.name} placeholder="e.g. Groceries"
                 onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <label>Type</label>
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button className="btn-primary wide">Add category</button>
        </form>

        <section className="panel">
          <h3 className="panel-title">Expense Categories</h3>
          <ul className="cat-list">
            {exp.map((c) => (
              <li key={c._id}><span>{c.name}</span>
                <button className="ibtn danger" onClick={() => remove(c)}>🗑️</button></li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h3 className="panel-title">Income Categories</h3>
          <ul className="cat-list">
            {inc.map((c) => (
              <li key={c._id}><span>{c.name}</span>
                <button className="ibtn danger" onClick={() => remove(c)}>🗑️</button></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}