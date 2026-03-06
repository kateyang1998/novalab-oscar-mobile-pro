// ─── src/components/schedule/CalendarHeader.jsx ──────────────────────────────
/**
 * Props:
 *   title        {string}   e.g. "April 2026" or "Wednesday - April 15, 2026"
 *   onPrev       {function} called when left arrow tapped
 *   onNext       {function} called when right arrow tapped
 *   onTitlePress {function} called when title tapped (e.g. open date picker)
 */

export default function CalendarHeader({ title, onPrev, onNext, onTitlePress }) {
  return (
    <div style={styles.wrapper}>
      <button onClick={onPrev} style={styles.arrow} aria-label="Previous">‹</button>

      <button onClick={onTitlePress} style={styles.title} aria-label="Select date">
        {title}
        <span style={styles.caret}>▼</span>
      </button>

      <button onClick={onNext} style={styles.arrow} aria-label="Next">›</button>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px 6px",
    flexShrink: 0,
  },
  arrow: {
    background: "none",
    border: "none",
    fontSize: 26,
    color: "#007AFF",
    cursor: "pointer",
    padding: "0 8px",
    lineHeight: 1,
    borderRadius: 6,
  },
  title: {
    background: "none",
    border: "none",
    fontSize: 18,
    fontWeight: 700,
    color: "#1C1C1E",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
    padding: 0,
  },
  caret: {
    fontSize: 10,
    color: "#8E8E93",
    marginTop: 2,
  },
};