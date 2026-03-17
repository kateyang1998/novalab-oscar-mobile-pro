// ─── src/components/schedule/AppointmentBlock.jsx ────────────────────────────
/**
 * Absolutely-positioned block rendered inside a timeline column.
 *
 * Props:
 *   appointment {object}   { id, patientName, type, startTime, endTime, status }
 *   top         {number}   px offset from top of timeline
 *   height      {number}   px height of the block
 *   compact     {boolean}  true = week view (less space), false = day view
 *   onClick     {function} (appointment) => void
 */

import { getTypeColors, formatTime12h, APPOINTMENT_STATUS } from "./Scheduleutils";
import theme from '../../styles/theme';
import { IconCheck, IconX, IconCircle } from '../common/Icons';

export default function AppointmentBlock({ appointment, top, height, compact = false, onClick }) {
  const colors = getTypeColors(appointment.type);
  const isCancelled = appointment.status === "Cancelled";
  const statusCfg = APPOINTMENT_STATUS[appointment.status] ?? APPOINTMENT_STATUS["Scheduled"];

  const shortName = (() => {
    const parts = appointment.patientName.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}. ${parts[parts.length - 1]}`
      : appointment.patientName;
  })();

  return (
    <button
      onClick={() => onClick?.(appointment)}
      title={`${appointment.patientName} — ${appointment.type} @ ${formatTime12h(appointment.startTime)}`}
      style={{
        ...styles.block,
        top,
        height,
        background: isCancelled ? 'transparent' : colors.bg,
        borderLeft: isCancelled ? `3px dashed ${theme.colors.paleSky}` : `3px solid ${colors.border}`,
        opacity: isCancelled ? 0.6 : 1,
      }}
    >
      {/* Time — shown only in day view */}
      {!compact && (
        <span style={{ ...styles.time, color: isCancelled ? theme.colors.paleSky : colors.text }}>
          {formatTime12h(appointment.startTime)}
        </span>
      )}

      {/* Patient name */}
        <span style={{
        ...styles.name,
        color: isCancelled ? theme.colors.paleSky : theme.colors.oscarBlack,
        fontSize: compact ? 9 : 12,
      }}>
        {compact ? shortName : appointment.patientName}
      </span>

      {/* Appointment type — only if tall enough */}
      {height > 36 && (
          <span style={{
          ...styles.type,
          color: isCancelled ? theme.colors.paleSky : colors.text,
          fontSize: compact ? 8 : 10,
        }}>
          {appointment.type}
        </span>
      )}

      {/* Status — day view only, tall enough */}
      {!compact && height > 52 && (
        <span style={{ ...styles.status, color: statusCfg.color, display: 'flex', alignItems: 'center', gap: 6 }}>
          {appointment.status && appointment.status.toLowerCase() === 'finished' && (
            <IconCheck size={14} color={statusCfg.color} />
          )}
          {appointment.status && appointment.status.toLowerCase() === 'cancelled' && (
            <IconX size={14} color={statusCfg.color} />
          )}
          {appointment.status && appointment.status.toLowerCase() !== 'finished' && appointment.status.toLowerCase() !== 'cancelled' && (
            <IconCircle size={10} color={statusCfg.color} />
          )}

          <span>{appointment.status}</span>
        </span>
      )}

      {/* Status dot — compact (week) view */}
      {compact && height > 44 && (
        <span style={{ lineHeight: 1 }}>
          {appointment.status && appointment.status.toLowerCase() === 'finished' && (
            <IconCheck size={10} color={statusCfg.color} />
          )}
          {appointment.status && appointment.status.toLowerCase() === 'cancelled' && (
            <IconX size={10} color={statusCfg.color} />
          )}
          {appointment.status && appointment.status.toLowerCase() !== 'finished' && appointment.status.toLowerCase() !== 'cancelled' && (
            <IconCircle size={8} color={statusCfg.color} />
          )}
        </span>
      )}
    </button>
  );
}

const styles = {
  block: {
    position: "absolute",
    left: 2,
    right: 2,
    border: "none",
    borderRadius: 6,
    padding: "4px 6px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    overflow: "hidden",
    textAlign: "left",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    fontFamily: theme.font.family,
    gap: 1,
  },
  time: {
    fontSize: 10,
    fontWeight: 500,
    lineHeight: 1.3,
  },
  name: {
    fontWeight: 700,
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
  type: {
    opacity: 0.8,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
  status: {
    fontSize: 10,
    fontWeight: 500,
    marginTop: 2,
    lineHeight: 1,
  },
};