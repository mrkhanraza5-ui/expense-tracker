function Summary({ summary }) {
  const total = summary.total || 0;
  const byCategory = summary.byCategory || [];

  return (
    <div className="summary">
      <div className="card total-card">
        <h3>Total Spent</h3>
        <p className="total-amount">₹{total.toFixed(2)}</p>
        <span className="chip">{summary.count} transactions</span>
      </div>

      <div className="card breakdown-card">
        <h3>📊 By Category</h3>
        {byCategory.length === 0 ? (
          <p className="muted">No data yet</p>
        ) : (
          byCategory.map((c) => (
            <div className="bar-row" key={c._id}>
              <span className="bar-label">{c._id}</span>
              <div className="bar-track">
                <div className="bar-fill"
                     style={{ width: `${total > 0 ? (c.total / total) * 100 : 0}%` }} />
              </div>
              <span className="bar-value">₹{c.total.toFixed(0)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Summary;