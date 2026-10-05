const CAT_COLORS = {
  Food: '#f97316', Travel: '#38bdf8', Shopping: '#f472b6', Bills: '#facc15',
  Entertainment: '#a78bfa', Health: '#34d399', Other: '#94a3b8',
};
const INC_COLORS = {
  Salary: '#34d399', Freelance: '#38bdf8', Business: '#a78bfa',
  Gift: '#f472b6', Investment: '#facc15', Refund: '#2dd4bf', Other: '#94a3b8',
};
const EXPENSE_CATS = ['All', ...Object.keys(CAT_COLORS)];
const INCOME_CATS = ['All', ...Object.keys(INC_COLORS)];

export default function ExpenseTable({ expenses, incomes, loading, tab, setTab,
                                       search, setSearch, filterCategory,
                                       setFilterCategory, onEdit, onDelete }) {
  const isExpense = tab === 'expense';
  const items = isExpense ? expenses : incomes;
  const colors = isExpense ? CAT_COLORS : INC_COLORS;
  const cats = isExpense ? EXPENSE_CATS : INCOME_CATS;
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN',
    { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <section className="card table-card" id="expenses-card">
      <div className="table-head">
        <div className="tabs">
          <button className={`tab-btn ${isExpense ? 'on' : ''}`}
                  onClick={() => setTab('expense')}>↓ Expenses</button>
          <button className={`tab-btn ${!isExpense ? 'on-income' : ''}`}
                  onClick={() => setTab('income')}>↑ Income</button>
        </div>
        <input className="search" placeholder="🔍 Search…"
               value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="chips">
        {cats.map(c => (
          <button key={c} className={`chip ${filterCategory === c ? 'on' : ''}`}
                  onClick={() => setFilterCategory(c)}>{c}</button>
        ))}
      </div>

      <div className="table-wrap">
        {loading ? <p className="empty">Loading…</p>
         : items.length === 0 ? (
           <p className="empty">{isExpense
             ? 'No expenses found — click “+ New Expense” to add one.'
             : 'No income entries yet — click “+ New Income” to add one.'}</p>
         ) : (
          <table>
            <thead>
              <tr>
                <th>{isExpense ? 'Expense' : 'Source'}</th>
                <th>Date</th><th>Category</th>
                <th className="num">Amount</th><th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(e => (
                <tr key={e._id}>
                  <td>
                    <div className="t-title">{e.title}</div>
                    {e.notes && <div className="t-notes">{e.notes}</div>}
                  </td>
                  <td className="t-date">{fmt(e.date)}</td>
                  <td>
                    <span className="badge" style={{
                      color: colors[e.category] || '#94a3b8',
                      background: `${colors[e.category] || '#94a3b8'}1f`,
                      border: `1px solid ${colors[e.category] || '#94a3b8'}55`,
                    }}>{e.category}</span>
                  </td>
                  <td className={`num amt ${isExpense ? 'amt-out' : 'amt-in'}`}>
                    {isExpense ? '−' : '+'}₹{Number(e.amount).toFixed(2)}
                  </td>
                  <td className="row-actions">
                    <button className="ibtn" title="Edit" onClick={() => onEdit(e, tab)}>✏️</button>
                    <button className="ibtn danger" title="Delete" onClick={() => onDelete(e._id, tab)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}