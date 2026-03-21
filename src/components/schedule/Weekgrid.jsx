// ─── src/components/schedule/WeekGrid.jsx ────────────────────────────────────
/**
 * 7-column scrollable week timeline.
 *
 * Props:
 *   weekDates          {string[]}  7 "YYYY-MM-DD" strings Sun–Sat
 *   selectedDate       {string}    "YYYY-MM-DD"
 *   todayStr           {string}    "YYYY-MM-DD"
 *   appointmentsByDate {object}    { "YYYY-MM-DD": [appointment, ...] }
 *   onSelectDate       {function}  (dateStr) => void
 *   onAppointmentPress {function}  (appointment) => void
 */

import AppointmentBlock from "./Appointmentblock";
import theme from '../../styles/theme';
import TimeColumn from "./Timecolumn";
import {
  DAYS_SHORT,
  TIMELINE_HOURS,
  HOUR_HEIGHT,
  START_HOUR,
  getTimelinePosition,
} from "./Scheduleutils";

export default function WeekGrid({
  weekDates, todayStr,
  appointmentsByDate, onSelectDate, onAppointmentPress,
}) {
  return (
    <div style={styles.wrapper}>
      {/* Column headers */}
      <div style={styles.headerRow}>
        <div style={{ width: 44, flexShrink: 0 }} />
        {weekDates.map((d, i) => {
          const dayNum = new Date(d + "T00:00:00").getDate();
          const isToday = d === todayStr;
          return (
            <div
              key={d}
              onClick={() => onSelectDate(d)}
                style={{
                    ...styles.dayHeader,
                  }}
            >
              <span style={styles.dayLabel}>{DAYS_SHORT[i]}</span>
              <div style={{
                ...styles.dayNum,
                background: isToday ? theme.colors.oscarBlue : "transparent",
                color: isToday ? theme.colors.oscarWhite : theme.colors.oscarBlack,
                fontWeight: isToday ? 700 : 400,
              }}>
                {dayNum}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div style={styles.scrollArea}>
        <div style={styles.gridBody}>
          <TimeColumn hours={TIMELINE_HOURS} hourHeight={HOUR_HEIGHT} />

          {weekDates.map((d) => {
            const appts = (appointmentsByDate[d] ?? []).filter(
              (a) => parseInt(a.startTime.split(":")[0]) >= START_HOUR
            );
            return (
              <div key={d} style={styles.dayColumn}>
                {TIMELINE_HOURS.map((h) => (
                  <div key={h} style={{ height: HOUR_HEIGHT, borderBottom: `1px solid ${theme.colors.oscarWhite}` }} />
                ))}
                {appts.map((appt) => {
                  const { top, height } = getTimelinePosition(appt.startTime, appt.endTime);
                  return (
                    <AppointmentBlock
                      key={appt.id}
                      appointment={appt}
                      top={top}
                      height={height}
                      compact={true}
                      onClick={onAppointmentPress}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
  },
  headerRow: {
    display: "flex",
    borderBottom: `1px solid ${theme.colors.oscarWhite}`,
    flexShrink: 0,
  },
  dayHeader: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "6px 0 4px",
    cursor: "pointer",
    gap: 2,
  },
  dayLabel: {
    fontSize: 10,
    color: theme.colors.paleSky,
    fontWeight: 600,
    fontFamily: theme.font.family,
  },
  dayNum: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontFamily: theme.font.family,
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
  },
  gridBody: {
    display: "flex",
    position: "relative",
  },
  dayColumn: {
    flex: 1,
    position: "relative",
  },
};