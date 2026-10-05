import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../auth';

const NAV = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/transactions', label: 'Transactions', icon: 'card' },
  { to: '/add-expense', label: 'Add Expense', icon: 'coin' },
  { to: '/add-income', label: 'Add Income', icon: 'inbox' },
  { to: '/budgets', label: 'Budgets', icon: 'target' },
  { to: '/reports', label: 'Reports', icon: 'chart' },
  { to: '/categories', label: 'Categories', icon: 'book' },
  { to: '/profile', label: 'Profile', icon: 'user' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const title = NAV.find((n) => n.to === pathname)?.label || 'Dashboard';

  return (
    <div className="shell">
      <aside className="sbar">
        <div className="brand">
          <span className="brand-ico"><Icon name="clock" size={20} /></span>
          <div><strong>ExpenseWise</strong><small>Money made clear</small></div>
        </div>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
                     className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon name={n.icon} /><span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sbar-foot">
          <div className="user-chip">
            <span className="user-av">{(user.name?.[0] || 'U').toUpperCase()}</span>
            <div><strong>{user.name}</strong><small>{user.email}</small></div>
          </div>
          <button className="logout" onClick={() => { logout(); navigate('/'); }}>
            <Icon name="logout" size={16} /> Log out
          </button>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <div><span className="eyebrow">EXPENSEWISE</span><h1>{title}</h1></div>
          <div className="add-wrap">
            <button className="btn-primary" onClick={() => setMenuOpen((o) => !o)}>
              <Icon name="plus" size={15} /> Add transaction
            </button>
            {menuOpen && (
              <div className="add-menu">
                <button onClick={() => { setMenuOpen(false); navigate('/add-expense'); }}>− Expense</button>
                <button className="inc" onClick={() => { setMenuOpen(false); navigate('/add-income'); }}>+ Income</button>
              </div>
            )}
          </div>
        </header>
        <main><Outlet /></main>
      </div>
    </div>
  );
}