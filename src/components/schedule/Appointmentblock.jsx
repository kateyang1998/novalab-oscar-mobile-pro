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
        background: isCancelled ? "#F2F2F7" : colors.bg,
        borderLeft: `3px solid ${isCancelled ? "#C7C7CC" : colors.border}`,
        opacity: isCancelled ? 0.65 : 1,
      }}
    >
      {/* Time — shown only in day view */}
      {!compact && (
        <span style={{ ...styles.time, color: isCancelled ? "#8E8E93" : colors.text }}>
          {formatTime12h(appointment.startTime)}
        </span>
      )}

      {/* Patient name */}
      <span style={{
        ...styles.name,
        color: isCancelled ? "#8E8E93" : colors.text,
        fontSize: compact ? 9 : 12,
      }}>
        {compact ? shortName : appointment.patientName}
      </span>

      {/* Appointment type — only if tall enough */}
      {height > 36 && (
        <span style={{
          ...styles.type,
          color: isCancelled ? "#8E8E93" : colors.text,
          fontSize: compact ? 8 : 10,
        }}>
          {appointment.type}
        </span>
      )}

      {/* Status — day view only, tall enough */}
      {!compact && height > 52 && (
        <span style={{ ...styles.status, color: statusCfg.color }}>
          {statusCfg.icon} {appointment.status}
        </span>
      )}

      {/* Status dot — compact (week) view */}
      {compact && height > 44 && (
        <span style={{ fontSize: 8, color: statusCfg.color, lineHeight: 1 }}>
          {statusCfg.icon}
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
    fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
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