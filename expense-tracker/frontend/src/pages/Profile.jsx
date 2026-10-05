import { useEffect, useState } from 'react';
import { getSummary } from '../services/api';
import { useAuth } from '../auth';

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

export default function Profile() {
  const { user, logout } = useAuth();
  const [s, setS] = useState(null);
  useEffect(() => { getSummary().then((r) => setS(r.data)).catch(() => {}); }, []);

  return (
    <div className="page">
      <section className="panel profile-panel">
        <span className="user-av big">{(user.name?.[0] || 'U').toUpperCase()}</span>
        <h3>{user.name}</h3>
        <p className="muted">{user.email}</p>
        {s && (
          <div className="fgrid" style={{ marginTop: 18, width: '100%' }}>
            <div className="mini-stat"><span>Total income</span><strong className="in">{inr(s.totalIncome)}</strong></div>
            <div className="mini-stat"><span>Total expenses</span><strong className="out">{inr(s.totalExpense)}</strong></div>
            <div className="mini-stat"><span>Balance</span><strong>{inr(s.balance)}</strong></div>
            <div className="mini-stat"><span>Transactions</span><strong>{s.expenseCount + s.incomeCount}</strong></div>
          </div>
        )}
        <button className="btn-outline" style={{ marginTop: 18 }} onClick={logout}>Log out</button>
        <p className="muted small">Demo authentication — sessions are stored in localStorage. Ask about JWT for real auth.</p>
      </section>
    </div>
  );
}