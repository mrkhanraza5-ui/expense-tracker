import { useEffect, useState } from 'react';
import { getExpenses, getIncomes, getSummary, deleteExpense, deleteIncome } from '../services/api';
import Icon from '../components/Icon';
import TransactionModal from '../components/TransactionModal';
import { downloadTransactionsPDF } from '../utils/pdf';

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const [e, i, s] = await Promise.all([
        getExpenses({ search }), getIncomes({ search }), getSummary(),
      ]);
      setSummary(s.data);
      setItems([...e.data.map((x) => ({ ...x, kind: 'expense' })),
                ...i.data.map((x) => ({ ...x, kind: 'income' }))]
        .sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch { setErr('⚠️ Cannot reach the API.'); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [search]);

  const shown = items.filter((t) => tab === 'all' || t.kind === tab);

  const remove = async (t) => {
    if (!window.confirm(`Delete “${t.title}”?`)) return;
    if (t.kind === 'income') await deleteIncome(t._id); else await deleteExpense(t._id);
    load();
  };

  const downloadPDF = () =>
    downloadTransactionsPDF(
      items.filter((t) => t.kind === 'expense'),
      items.filter((t) => t.kind === 'income'),
      summary || {}
    );

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-head">
          <h3>All transactions</h3>
          <div className="head-tools">
            <input className="input search" placeholder="🔍 Search…"
                   value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn-outline" onClick={downloadPDF}>
              <Icon name="download" size={15} /> Download PDF
            </button>
          </div>
        </div>

        {err && <div className="banner">{err}</div>}

        <div className="chips">
          {[['all', 'All'], ['expense', 'Expenses'], ['income', 'Income']].map(([k, lbl]) => (
            <button key={k} className={`chip ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{lbl}</button>
          ))}
        </div>

        {shown.length === 0 ? <p className="empty">No transactions found.</p> : (
          <ul className="tx-list">
            {shown.map((t) => (
              <li key={t._id} className="tx-row">
                <span className={`tx-ico ${t.kind === 'income' ? 'in' : 'out'}`}>
                  {t.kind === 'income' ? '+' : '−'}
                </span>
                <div className="tx-main">
                  <strong>{t.title}</strong>
                  <small>{t.category}{t.paymentMethod ? ` • ${t.paymentMethod}` : ''} • {fmtDate(t.date)}
                    {t.notes ? ` • ${t.notes}` : ''}</small>
                </div>
                <div className="tx-side">
                  <span className={`tx-amt ${t.kind === 'income' ? 'in' : 'out'}`}>
                    {t.kind === 'income' ? '+' : '−'}{inr(t.amount)}
                  </span>
                  <button className="ibtn" title="Edit" onClick={() => setEditing(t)}>✏️</button>
                  <button className="ibtn danger" title="Delete" onClick={() => remove(t)}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing && (
        <TransactionModal item={editing} onClose={() => setEditing(null)}
                          onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}