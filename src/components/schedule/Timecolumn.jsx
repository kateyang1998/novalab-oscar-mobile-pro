// ─── src/components/schedule/TimeColumn.jsx ──────────────────────────────────
/**
 * Left-side hour labels aligned to timeline grid rows.
 *
 * Props:
 *   hours      {number[]}  e.g. [8, 9, 10, ..., 17]
 *   hourHeight {number}    px height per hour row — must match the grid
 */

import theme from '../../styles/theme';

export default function TimeColumn({ hours, hourHeight }) {
  return (
    <div style={{ width: 44, flexShrink: 0 }}>
      {hours.map((h) => {
        const label =
          h === 0 ? "12 AM"
            : h < 12 ? `${h} AM`
              : h === 12 ? "12 PM"
                : `${h - 12} PM`;

        return (
          <div key={h} style={{ height: hourHeight, display: "flex", alignItems: "flex-start", paddingTop: 4 }}>
            <span style={styles.label}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  label: {
    fontSize: 10,
    color: theme.colors.paleSky,
    textAlign: "right",
    width: "100%",
    paddingRight: 6,
    fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
    lineHeight: 1,
  },
};