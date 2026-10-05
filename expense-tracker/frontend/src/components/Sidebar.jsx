import { useState } from 'react';

const USER = { name: 'Mohammad Raza Khan', initials: 'MR' };

export default function Sidebar({ onNewExpense }) {
  const [active, setActive] = useState('home');
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const nav = [
    { id: 'home',     icon: '🏠', label: 'Home',        onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'expenses', icon: '💳', label: 'Expenses',    onClick: () => go('expenses-card') },
    { id: 'reports',  icon: '📊', label: 'Reports',     onClick: () => go('reports-card') },
    { id: 'new',      icon: '➕', label: 'New Expense', onClick: onNewExpense },
    { id: 'settings', icon: '⚙️', label: 'Settings',    onClick: () => alert('Settings — demo placeholder') },
    { id: 'support',  icon: '☎️', label: 'Support',     onClick: () => alert('Support — demo placeholder') },
  ];

  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar">{USER.initials}</div>
        <h4>{USER.name}</h4>
      </div>
      <nav>
        {nav.map(n => (
          <button key={n.id}
                  className={`nav-item ${active === n.id ? 'active' : ''}`}
                  onClick={() => { setActive(n.id); n.onClick(); }}>
            <span className="nav-ico">{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>
      <div className="logo">EXPENS<span>IO</span></div>
    </aside>
  );
}