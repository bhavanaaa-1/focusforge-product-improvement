export default function ProgressTracker({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const remaining = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const filledBlocks = Math.round(percentage / 10);
  const emptyBlocks = 10 - filledBlocks;

  return (
    <div className="progress-tracker">
      <h3>Today's Progress</h3>

      {total === 0 ? (
        <p className="progress-empty">No tasks yet. Add one above!</p>
      ) : (
        <>
          <div className="progress-summary">
            <span className="progress-count">
              {completed} / {total} tasks completed
            </span>
            <span className="progress-percentage">{percentage}%</span>
          </div>

          <div className="progress-bar">
            {Array.from({ length: filledBlocks }, (_, i) => (
              <span key={`filled-${i}`} className="block filled" />
            ))}
            {Array.from({ length: emptyBlocks }, (_, i) => (
              <span key={`empty-${i}`} className="block empty" />
            ))}
          </div>

          <div className="progress-stats">
            <div className="stat">
              <span className="stat-value">{completed}</span>
              <span className="stat-label">Done</span>
            </div>
            <div className="stat">
              <span className="stat-value">{remaining}</span>
              <span className="stat-label">Remaining</span>
            </div>
            <div className="stat">
              <span className="stat-value">{total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
