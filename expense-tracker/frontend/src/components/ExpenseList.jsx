const CATEGORY_COLORS = {
  Food: '#f97316', Travel: '#3b82f6', Shopping: '#ec4899', Bills: '#eab308',
  Entertainment: '#8b5cf6', Health: '#10b981', Other: '#6b7280',
};

function ExpenseList({ expenses, loading, onEdit, onDelete, filterCategory }) {
  if (loading) return <div className="card list-card"><p className="muted">Loading…</p></div>;

  return (
    <div className="card list-card">
      <h2>🧾 Transactions {filterCategory !== 'All' && `— ${filterCategory}`}</h2>
      {expenses.length === 0 ? (
        <p className="muted">No expenses found — add your first one! 💸</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((exp) => (
            <li key={exp._id} className="expense-item">
              <span className="dot" style={{ background: CATEGORY_COLORS[exp.category] }} />
              <div className="info">
                <strong>{exp.title}</strong>
                <small>
                  {new Date(exp.date).toLocaleDateString('en-IN',
                    { day: 'numeric', month: 'short', year: 'numeric' })} · {exp.category}
                </small>
                {exp.notes && <em className="notes">{exp.notes}</em>}
              </div>
              <div className="actions">
                <span className="amount">₹{Number(exp.amount).toFixed(2)}</span>
                <button className="icon-btn edit" title="Edit" onClick={() => onEdit(exp)}>✏️</button>
                <button className="icon-btn del" title="Delete" onClick={() => onDelete(exp._id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;