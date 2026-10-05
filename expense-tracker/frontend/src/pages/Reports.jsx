import { useEffect, useState } from 'react';
import { getExpenses, getIncomes, getSummary } from '../services/api';
import Icon from '../components/Icon';
import { downloadTransactionsPDF } from '../utils/pdf';

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
const short = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${Math.round(n)}`);

export default function Reports() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    Promise.all([getSummary(), getExpenses(), getIncomes()])
      .then(([sum, e, i]) => setS({ ...sum.data, expenses: e.data, incomes: i.data }))
      .catch(() => setErr('⚠️ Cannot reach the API.'));
  }, []);

  if (err) return <div className="banner">{err}</div>;
  if (!s) return <p className="muted">Loading…</p>;

  const cats = (s.byCategory || []).slice(0, 6);
  const maxCat = Math.max(...cats.map((c) => c.total), 1);
  const maxMonth = Math.max(...s.byMonth.map((m) => Math.max(m.expense, m.income)), 1);
  const mLabel = (ym) => new Date(`${ym}-01`).toLocaleString('en', { month: 'short' });

  return (
    <div className="page">
      <div className="stat-grid">
        <div className="stat-card"><div><span className="stat-label">Income</span>
          <strong className="stat-val">{inr(s.totalIncome)}</strong></div>
          <span className="stat-ico green"><Icon name="coin" size={17} /></span></div>
        <div className="stat-card"><div><span className="stat-label">Expenses</span>
          <strong className="stat-val">{inr(s.totalExpense)}</strong></div>
          <span className="stat-ico red"><Icon name="card" size={17} /></span></div>
        <div className="stat-card"><div><span className="stat-label">Balance</span>
          <strong className="stat-val">{inr(s.balance)}</strong></div>
          <span className="stat-ico blue"><Icon name="wallet" size={17} /></span></div>
        <div className="stat-card"><div><span className="stat-label">Transactions</span>
          <strong className="stat-val">{s.expenseCount + s.incomeCount}</strong></div>
          <span className="stat-ico purple"><Icon name="chart" size={17} /></span></div>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h3>Charts</h3>
          <button className="btn-outline" onClick={() => downloadTransactionsPDF(s.expenses, s.incomes, s)}>
            <Icon name="download" size={15} /> Download PDF
          </button>
        </div>
        <div className="charts">
          <div className="chart">
            <h4>Spending by category</h4>
            {cats.length === 0 ? <p className="empty">No data yet</p> : (
              <div className="bars">
                {cats.map((c) => (
                  <div className="bar-col" key={c._id} title={`${c._id}: ${inr(c.total)}`}>
                    <span className="bar-val">{short(c.total)}</span>
                    <div className="bar blue" style={{ height: `${(c.total / maxCat) * 100}%` }} />
                    <span className="bar-label">{c._id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="chart">
            <h4>Income vs expense trend</h4>
            {s.byMonth.length === 0 ? <p className="empty">No data yet</p> : (
              <>
                <div className="bars">
                  {s.byMonth.map((m) => (
                    <div className="bar-col" key={m._id}>
                      <span className="bar-val">{short(Math.max(m.expense, m.income))}</span>
                      <div className="bar-pair">
                        <div className="bar red" style={{ height: `${(m.expense / maxMonth) * 100}%` }} />
                        <div className="bar green" style={{ height: `${(m.income / maxMonth) * 100}%` }} />
                      </div>
                      <span className="bar-label">{mLabel(m._id)}</span>
                    </div>
                  ))}
                </div>
                <div className="legend">
                  <span><i style={{ background: '#ef4444' }} />Expense</span>
                  <span><i style={{ background: '#22c55e' }} />Income</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}