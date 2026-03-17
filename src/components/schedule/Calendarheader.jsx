// ─── src/components/schedule/CalendarHeader.jsx ──────────────────────────────
/**
 * Props:
 *   title        {string}   e.g. "April 2026" or "Wednesday - April 15, 2026"
 *   onPrev       {function} called when left arrow tapped
 *   onNext       {function} called when right arrow tapped
 *   onTitlePress {function} called when title tapped (e.g. open date picker)
 */

import theme from '../../styles/theme';
import { IconChevronLeft, IconChevronRight, IconChevronDown } from '../common/Icons';

export default function CalendarHeader({ title, onPrev, onNext, onTitlePress }) {
  return (
    <div style={styles.wrapper}>
      <button onClick={onPrev} style={styles.arrow} aria-label="Previous">
        <IconChevronLeft size={20} color={theme.colors.oscarBlue} />
      </button>

      <button onClick={onTitlePress} style={styles.title} aria-label="Select date">
        {title}
        <IconChevronDown style={styles.caret} color={theme.colors.paleSky} />
      </button>

      <button onClick={onNext} style={styles.arrow} aria-label="Next">
        <IconChevronRight size={20} color={theme.colors.oscarBlue} />
      </button>
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
    color: theme.colors.oscarBlue,
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
    color: theme.colors.oscarBlack,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: theme.font.family,
    padding: 0,
  },
  caret: {
    fontSize: 10,
    color: theme.colors.paleSky,
    marginTop: 2,
  },
};