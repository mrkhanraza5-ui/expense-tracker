import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses, getIncomes, getSummary } from '../services/api';
import Icon from '../components/Icon';

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [e, i, s] = await Promise.all([getExpenses(), getIncomes(), getSummary()]);
        const tx = [...e.data.map((x) => ({ ...x, kind: 'expense' })),
                    ...i.data.map((x) => ({ ...x, kind: 'income' }))]
          .sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
        setData({ s: s.data, tx });
      } catch { setErr('⚠️ Cannot reach the API — is the backend running?'); }
    })();
  }, []);

  if (err) return <main className="page"><div className="banner">{err}</div></main>;
  if (!data) return <main className="page"><p className="muted">Loading…</p></main>;

  const { s, tx } = data;
  const stats = [
    { label: 'Total balance', value: inr(s.balance), icon: 'wallet', cls: 'blue' },
    { label: 'Total income', value: inr(s.totalIncome), icon: 'coin', cls: 'green' },
    { label: 'Total expenses', value: inr(s.totalExpense), icon: 'card', cls: 'red' },
    { label: 'This month', value: inr(s.thisMonthExpense), icon: 'calendar', cls: 'purple' },
  ];

  return (
    <div className="page">
      <p className="page-sub">Welcome back, {s ? 'Raza' : ''}. Here's your money overview.</p>

      <div className="stat-grid">
        {stats.map((st) => (
          <div className="stat-card" key={st.label}>
            <div><span className="stat-label">{st.label}</span><strong className="stat-val">{st.value}</strong></div>
            <span className={`stat-ico ${st.cls}`}><Icon name={st.icon} size={17} /></span>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="panel-head">
          <h3>Recent transactions</h3>
          <Link to="/transactions" className="link">View all</Link>
        </div>
        {tx.length === 0 ? <p className="empty">No transactions yet — use “Add transaction”.</p> : (
          <ul className="tx-list">
            {tx.map((t) => (
              <li key={t._id} className="tx-row">
                <span className={`tx-ico ${t.kind === 'income' ? 'in' : 'out'}`}>
                  {t.kind === 'income' ? '+' : '−'}
                </span>
                <div className="tx-main">
                  <strong>{t.title}</strong>
                  <small>{t.category} • {fmtDate(t.date)}</small>
                </div>
                <span className={`tx-amt ${t.kind === 'income' ? 'in' : 'out'}`}>
                  {t.kind === 'income' ? '+' : '−'}{inr(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}