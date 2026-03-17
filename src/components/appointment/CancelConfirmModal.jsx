// ─── src/components/schedule/CancelConfirmModal.jsx ──────────────────────────
/**
 * Confirmation modal shown when user taps "Cancel Appointment"
 *
 * Props:
 *   appointment {object}   the appointment being cancelled
 *   onConfirm   {function} called when user taps "Yes"
 *   onDismiss   {function} called when user taps "Cancel"
 */

import { formatTime12h, MONTHS } from "../schedule/Scheduleutils.js";
import theme from '../../styles/theme';

export default function CancelConfirmModal({ appointment, onConfirm, onDismiss }) {
  if (!appointment) return null;

  const date = new Date(appointment.date + "T00:00:00");
  const formattedDate = `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  const formattedTime = formatTime12h(appointment.startTime);

  return (
    // Backdrop
    <div style={styles.backdrop} onClick={onDismiss}>
      {/* Modal box — stop click from closing when clicking inside */}
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p style={styles.title}>Are you sure you want to cancel an appointment?</p>

        <p style={styles.detail}>ID: {appointment.patientId ?? "P-0021"} {appointment.patientName}</p>
        <p style={styles.detail}>{appointment.type}</p>
        <p style={styles.detail}>{formattedDate} {formattedTime}</p>

        <div style={styles.actions}>
          <button onClick={onConfirm} style={styles.yesBtn}>Yes</button>
          <button onClick={onDismiss} style={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: theme.colors.overlay,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "0 24px",
  },
  modal: {
    background: theme.colors.oscarWhite,
    borderRadius: theme.radius.lg,
    padding: "24px 20px 20px",
    width: "100%",
    maxWidth: 340,
    boxShadow: theme.shadows.lg,
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.oscarBlack,
    marginBottom: 16,
    lineHeight: 1.4,
    fontFamily: theme.font.family,
  },
  detail: {
    fontSize: 14,
    color: theme.colors.shark,
    margin: "2px 0",
    fontFamily: theme.font.family,
  },
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 20,
  },
  yesBtn: {
    flex: 1,
    padding: "12px 0",
    background: theme.colors.oscarRed,
    color: theme.colors.oscarWhite,
    border: "none",
    borderRadius: theme.radius.md,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: theme.font.family,
  },
  cancelBtn: {
    flex: 1,
    padding: "12px 0",
    background: theme.colors.oscarWhite,
    color: theme.colors.oscarBlack,
    border: `1.5px solid ${theme.colors.paleSky}`,
    borderRadius: theme.radius.md,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: theme.font.family,
  },
};