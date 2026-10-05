export default function Overview({ summary }) {
  const bal = summary.balance || 0;
  const rows = [
    { icon: '💰', label: 'Total Income', value: `₹${(summary.totalIncome || 0).toFixed(2)}`, cls: 'val-green' },
    { icon: '💸', label: 'Total Spent',  value: `₹${(summary.totalExpense || 0).toFixed(2)}`, cls: 'val-red' },
    { icon: '⚖️', label: 'Balance',
      value: `${bal < 0 ? '−' : '+'} ₹${Math.abs(bal).toFixed(2)}`,
      cls: bal >= 0 ? 'val-green' : 'val-red' },
    { icon: '🧾', label: 'Transactions',
      value: (summary.expenseCount || 0) + (summary.incomeCount || 0), cls: '' },
  ];

  return (
    <section className="card overview">
      <h3>Overview</h3>
      <ul>
        {rows.map(r => (
          <li key={r.label}>
            <span className="ov-left"><span className="ov-ico">{r.icon}</span>{r.label}</span>
            <strong className={`ov-val ${r.cls}`}>{r.value}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}