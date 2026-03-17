// ─── src/components/schedule/AppointmentPill.jsx ─────────────────────────────
/**
 * Small colored label shown inside month grid cells.
 *
 * Props:
 *   appointment {object}   { id, patientName, type, status }
 *   onClick     {function} (appointment) => void
 */

import { getTypeColors } from "./Scheduleutils";
import theme from '../../styles/theme';

export default function AppointmentPill({ appointment, onClick }) {
  const colors = getTypeColors(appointment.type);
  const isCancelled = appointment.status === "Cancelled";

  const nameParts = appointment.patientName.trim().split(" ");
  const shortName =
    nameParts.length >= 2
      ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}`
      : appointment.patientName;

  return (
    <button
      onClick={() => onClick?.(appointment)}
      title={`${appointment.patientName} — ${appointment.type}`}
      style={{
        ...styles.pill,
        background: isCancelled ? theme.colors.oscarWhite : colors.bg,
        color: isCancelled ? theme.colors.paleSky : colors.text,
        textDecoration: isCancelled ? "line-through" : "none",
      }}
    >
      {shortName}
    </button>
  );
}

const styles = {
  pill: {
    display: "block",
    width: "100%",
    fontSize: 8.5,
    fontWeight: 600,
    borderRadius: 3,
    padding: "1.5px 4px",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    lineHeight: 1.4,
    fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
  },
};