// ─── src/screens/EditAppointmentScreen.jsx ───────────────────────────────────
/**
 * Edit Appointment Screen
 *
 * Opened when user taps an appointment block in the schedule.
 * Appointment data is passed via React Router location state:
 *
 *   navigate("/appointment/edit", { state: { appointment } })
 *
 * On Save & Sync → TODO: call OSCAR API, then go back
 * On Cancel Appointment → shows confirmation modal → goes back
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppointmentForm from "../components/schedule/AppointmentForm";
import CancelConfirmModal from "../components/schedule/CancelConfirmModal";

// ─── Sample previous notes — replace with API data later ─────────────────────
const SAMPLE_NOTES = [
  {
    date: "Feb 9, 2026",
    doctor: "Dr. Lee",
    type: "SOAP Note",
    text: "Follow-up for diabetes management...",
  },
];

export default function EditAppointmentScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // Appointment passed from ScheduleScreen via navigation state
  const incoming = location.state?.appointment;

  // ── Form state — pre-filled from incoming appointment ──────────────────────
  const [formData, setFormData] = useState({
    type: incoming?.type ?? "",
    status: incoming?.status ?? "Scheduled",
    date: incoming?.date ?? "",
    startTime: incoming?.startTime ?? "12:00",
    duration: incoming?.duration ?? "30 min",
    reasonForVisit: incoming?.reasonForVisit ?? "",
  });

  const [showCancelModal, setShowCancelModal] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleFieldChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSaveAndSync() {
    // TODO: call OSCAR API with formData
    console.log("Saving appointment:", formData);
    navigate(-1);
  }

  function handleCancelConfirm() {
    // TODO: call OSCAR API to cancel appointment
    console.log("Appointment cancelled");
    setShowCancelModal(false);
    navigate(-1);
  }

  // Build appointment object for the modal summary
  const appointmentForModal = {
    ...incoming,
    ...formData,
    patientId: incoming?.patientId ?? "—",
    patientName: incoming?.patientName ?? "Unknown",
  };

  return (
    <div style={styles.screen}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>←</button>
        <span style={styles.headerTitle}>Edit Appointment</span>
        <div style={{ width: 32 }} />
      </div>

      {/* ── Scrollable body ── */}
      <div style={styles.body}>

        {/* Patient info card — uses real data from appointment */}
        <div style={styles.patientCard}>
          <p style={styles.patientName}>
            {incoming?.patientName ?? "Unknown"}
          </p>
          {incoming?.patientId && (
            <p style={styles.patientMeta}>ID: {incoming.patientId}</p>
          )}
          {(incoming?.age || incoming?.gender) && (
            <p style={styles.patientMeta}>
              {incoming?.age ? `${incoming.age} years old` : ""}
              {incoming?.age && incoming?.gender ? " • " : ""}
              {incoming?.gender ?? ""}
            </p>
          )}
          {incoming?.dob && (
            <p style={styles.patientMeta}>DOB: {incoming.dob}</p>
          )}
        </div>

        {/* Appointment form */}
        <AppointmentForm
          formData={formData}
          onChange={handleFieldChange}
          onAddNote={() => console.log("Add note tapped")}
          previousNotes={SAMPLE_NOTES}
        />

        {/* Action buttons */}
        <button onClick={handleSaveAndSync} style={styles.saveBtn}>
          Save &amp; Sync
        </button>

        <button
          onClick={() => setShowCancelModal(true)}
          style={styles.cancelApptBtn}
        >
          Cancel Appointment
        </button>
      </div>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <CancelConfirmModal
          appointment={appointmentForModal}
          onConfirm={handleCancelConfirm}
          onDismiss={() => setShowCancelModal(false)}
        />
      )}
    </div>
  );
}

const styles = {
  screen: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#F2F2F7",
    fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    background: "#FFFFFF",
    borderBottom: "1px solid #E5E5EA",
    flexShrink: 0,
  },
  backBtn: {
    background: "none",
    border: "none",
    fontSize: 20,
    color: "#007AFF",
    cursor: "pointer",
    padding: 0,
    width: 32,
    fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1C1C1E",
    fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  patientCard: {
    background: "#FFFFFF",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1C1C1E",
    margin: 0,
    fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
  },
  patientMeta: {
    fontSize: 13,
    color: "#8E8E93",
    margin: 0,
    fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
  },
  saveBtn: {
    width: "100%",
    padding: "15px 0",
    background: "#007AFF",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
  },
  cancelApptBtn: {
    width: "100%",
    padding: "15px 0",
    background: "#D9534F",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
    marginBottom: 8,
  },
};