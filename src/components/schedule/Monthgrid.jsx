// ─── src/components/schedule/MonthGrid.jsx ───────────────────────────────────
/**
 * Full monthly calendar grid with appointment pills.
 *
 * Props:
 *   year               {number}   e.g. 2026
 *   month              {number}   0-indexed
 *   selectedDate       {string}   "YYYY-MM-DD"
 *   todayStr           {string}   "YYYY-MM-DD"
 *   appointmentsByDate {object}   { "YYYY-MM-DD": [appointment, ...] }
 *   onSelectDate       {function} (dateStr) => void
 *   onAppointmentPress {function} (appointment) => void
 */

import AppointmentPill from "./Appointmentpill";
import theme from '../../styles/theme';
import {
  DAYS_SHORT,
  getDaysInMonth,
  getFirstDayOfMonth,
  toDateString,
} from "./Scheduleutils";

const MAX_PILLS = 3;

export default function MonthGrid({
  year, month, selectedDate, todayStr,
  appointmentsByDate, onSelectDate, onAppointmentPress,
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);

  // Build 42-cell grid (6 rows × 7 cols)
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: prevMonDays - firstDay + 1 + i, isCurrent: false, dateStr: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrent: true, dateStr: toDateString(year, month, d) });
  }
  for (let d = 1; d <= 42 - cells.length; d++) {
    cells.push({ day: d, isCurrent: false, dateStr: null });
  }

  return (
    <div style={styles.wrapper}>
      {/* Day-of-week header row */}
      <div style={styles.headerRow}>
        {DAYS_SHORT.map((d, i) => (
          <div key={i} style={styles.headerCell}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={styles.grid}>
        {cells.map((cell, i) => {
          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === selectedDate;
          const appts = cell.dateStr ? (appointmentsByDate[cell.dateStr] ?? []) : [];
          const shown = appts.slice(0, MAX_PILLS);
          const overflow = appts.length - MAX_PILLS;

          return (
            <div
              key={i}
              onClick={() => cell.isCurrent && cell.dateStr && onSelectDate(cell.dateStr)}
                style={{
                    ...styles.cell,
                    cursor: cell.isCurrent ? "pointer" : "default",
                    background: isSelected && cell.isCurrent ? theme.colors.oscarWhite : "transparent",
                  }}
            >
              <div style={{
                ...styles.dayNum,
                background: isToday ? theme.colors.oscarBlue : "transparent",
                color: isToday ? theme.colors.oscarWhite : cell.isCurrent ? theme.colors.oscarBlack : theme.colors.paleSky,
                fontWeight: isToday ? 700 : 400,
              }}>
                {cell.day}
              </div>

              <div style={styles.pills}>
                {shown.map((appt) => (
                  <AppointmentPill
                    key={appt.id}
                    appointment={appt}
                    onClick={onAppointmentPress}
                  />
                ))}
                {overflow > 0 && (
                  <span style={styles.overflow}>+{overflow} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: "0 6px",
    overflow: "hidden",
  },
  headerRow: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    marginBottom: 2,
    flexShrink: 0,
  },
  headerCell: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: 600,
    color: theme.colors.paleSky,
    padding: "4px 0",
    fontFamily: theme.font.family,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    flex: 1,
    overflow: "hidden",
  },
  cell: {
    minHeight: 56,
    padding: "2px 2px 4px",
    display: "flex",
    flexDirection: "column",
    gap: 1,
    borderRadius: 6,
  },
  dayNum: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    margin: "0 auto 2px",
    fontFamily: theme.font.family,
  },
  pills: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  overflow: {
    fontSize: 7.5,
    color: theme.colors.paleSky,
    paddingLeft: 3,
    fontFamily: theme.font.family,
  },
};