// ─── src/components/schedule/DayTimeline.jsx ─────────────────────────────────
/**
 * Single-day scrollable timeline.
 *
 * Props:
 *   dateStr            {string}   "YYYY-MM-DD"
 *   appointments       {array}    appointments for this day
 *   onAppointmentPress {function} (appointment) => void
 */

import AppointmentBlock from "./Appointmentblock";
import TimeColumn from "./Timecolumn";
import theme from '../../styles/theme';
import {
  TIMELINE_HOURS,
  HOUR_HEIGHT,
  START_HOUR,
  getTimelinePosition,
} from "./Scheduleutils";

export default function DayTimeline({ appointments = [], onAppointmentPress }) {
  const visibleAppts = appointments.filter(
    (a) => parseInt(a.startTime.split(":")[0]) >= START_HOUR
  );

  return (
    <div style={styles.scrollArea}>
      <div style={styles.body}>
        <TimeColumn hours={TIMELINE_HOURS} hourHeight={HOUR_HEIGHT} />

        <div style={styles.eventsColumn}>
            {TIMELINE_HOURS.map((h) => (
                <div key={h} style={{ height: HOUR_HEIGHT, borderBottom: `1px solid ${theme.colors.oscarWhite}` }} />
              ))}

          {visibleAppts.map((appt) => {
            const { top, height } = getTimelinePosition(appt.startTime, appt.endTime);
            return (
              <AppointmentBlock
                key={appt.id}
                appointment={appt}
                top={top}
                height={height}
                compact={false}
                onClick={onAppointmentPress}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  scrollArea: {
    flex: 1,
    overflowY: "auto",
  },
  body: {
    display: "flex",
    position: "relative",
  },
  eventsColumn: {
    flex: 1,
    position: "relative",
    borderLeft: `1px solid ${theme.colors.oscarWhite}`,
  },
};