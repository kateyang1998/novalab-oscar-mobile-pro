// ─── src/components/schedule/ViewSwitcher.jsx ────────────────────────────────
/**
 * Props:
 *   activeView {string}   "month" | "week" | "day"
 *   onChange   {function} (view: string) => void
 */

import theme from '../../styles/theme';

const VIEWS = ["month", "week", "day"];

export default function ViewSwitcher({ activeView, onChange }) {
  return (
    <div style={styles.wrapper}>
      {VIEWS.map((view) => {
        const isActive = view === activeView;
        return (
          <button
            key={view}
            onClick={() => onChange(view)}
            style={{
              ...styles.btn,
              background: isActive ? theme.colors.oscarWhite : "transparent",
              color: isActive ? theme.colors.oscarBlue : theme.colors.paleSky,
              fontWeight: isActive ? 700 : 400,
              boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
            }}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    background: theme.colors.oscarWhite,
    borderRadius: 10,
    padding: 3,
    margin: "8px 16px",
    gap: 2,
    flexShrink: 0,
  },
  btn: {
    flex: 1,
    padding: "7px 0",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: theme.font.family,
  },
};