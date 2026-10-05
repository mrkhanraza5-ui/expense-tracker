const short = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${Math.round(n)}`);

export default function Reports({ summary }) {
  const cats = (summary.byCategory || []).slice(0, 6);
  const months = summary.byMonth || [];
  const maxCat = Math.max(...cats.map(c => c.total), 1);
  const maxMonth = Math.max(...months.map(m => Math.max(m.expense, m.income)), 1);
  const mLabel = (ym) => new Date(`${ym}-01`).toLocaleString('en', { month: 'short' });

  return (
    <section className="card" id="reports-card">
      <h3>Monthly Report</h3>
      <div className="charts">
        <div className="chart">
          <h4>Spending by Category</h4>
          {cats.length === 0 ? <p className="empty">No data yet</p> : (
            <div className="bars">
              {cats.map(c => (
                <div className="bar-col" key={c._id} title={`${c._id}: ₹${c.total.toFixed(2)}`}>
                  <span className="bar-val">{short(c.total)}</span>
                  <div className="bar teal" style={{ height: `${(c.total / maxCat) * 100}%` }} />
                  <span className="bar-label">{c._id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="chart">
          <h4>Income vs Expense Trend</h4>
          {months.length === 0 ? <p className="empty">No data yet</p> : (
            <>
              <div className="bars">
                {months.map(m => (
                  <div className="bar-col" key={m._id}
                       title={`Income: ₹${m.income.toFixed(2)} | Expense: ₹${m.expense.toFixed(2)}`}>
                    <span className="bar-val">{short(Math.max(m.expense, m.income))}</span>
                    <div className="bar-pair">
                      <div className="bar teal half"  style={{ height: `${(m.expense / maxMonth) * 100}%` }} />
                      <div className="bar green half" style={{ height: `${(m.income / maxMonth) * 100}%` }} />
                    </div>
                    <span className="bar-label">{mLabel(m._id)}</span>
                  </div>
                ))}
              </div>
              <div className="legend">
                <span><span className="legend-dot" style={{ background: '#2dd4bf' }} />Expense</span>
                <span><span className="legend-dot" style={{ background: '#34d399' }} />Income</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}