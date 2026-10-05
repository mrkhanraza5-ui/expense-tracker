export default function QuickAccess({ onNewExpense, onNewIncome, onExport, onRefresh }) {
  const items = [
    { icon: '💸', cls: 'qa-red',    label: '+ New Expense', onClick: onNewExpense },
    { icon: '💰', cls: 'qa-green',  label: '+ New Income',  onClick: onNewIncome },
    { icon: '⬇️', cls: 'qa-purple', label: 'Export CSV',    onClick: onExport },
    { icon: '🔄', cls: 'qa-blue',   label: 'Refresh Data',  onClick: onRefresh },
  ];

  return (
    <section className="card">
      <h3>Quick Access</h3>
      <div className="quick-row">
        {items.map(i => (
          <button key={i.label} className="qa-btn" onClick={i.onClick}>
            <span className={`qa-ico ${i.cls}`}>{i.icon}</span>{i.label}
          </button>
        ))}
      </div>
    </section>
  );
}