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

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppointmentForm from "../components/appointment/AppointmentForm.jsx";
import CancelConfirmModal from "../components/appointment/CancelConfirmModal.jsx";
import TopHeader from "../components/layout/TopHeader";
import theme from '../styles/theme';
import AddNoteButton from '../components/clinical_note/AddNoteButton';
import NoteCard from '../components/clinical_note/NoteCard';
import PatientInfoCard from '../components/patient/PatientInfoCard';
import UnsavedChangesModal from '../components/common/UnsavedChangesModal';

/*
  TODOs: Backend & Database integration (high-level)

  - Data models (database):
    - patients: id, name, dob, gender, phone, demographics, medical_record_number, last_visit
    - appointments: id, patient_id, type, status, date (YYYY-MM-DD), start_time (HH:MM), duration, reason, created_by, created_at, updated_at
    - clinical_notes: id, patient_id, appointment_id (nullable), author_id, title, body (SOAP sections), created_at, updated_at
    - audit / sync queue: records for offline edits, sync status, last_sync_at

  - API endpoints (examples):
    - GET /api/patients/:id
    - GET /api/patients/:id/notes
    - POST /api/patients/:id/notes
    - GET /api/appointments/:id
    - POST /api/appointments
    - PUT /api/appointments/:id
    - POST /api/appointments/:id/cancel

  - Client-side responsibilities:
    - Fetch patient and note lists on screen load (useEffect)
    - Validate form (no past dates, reasonable duration) before save
    - Optimistic UI updates and conflict resolution on sync failures
    - Error handling, retries, and background sync for offline-first UX
    - Authentication headers for API calls (bearer token/session)

  - Database considerations:
    - Create migrations for the above tables
    - Indexes on patient_id and appointment date/time
    - Referential integrity for appointment -> patient and note -> patient/appointment
    - Soft-delete flags for audit/history if required

  Implement the above incrementally: start with read-only GET endpoints to display real data,
  then implement POST/PUT for creating & updating appointments and notes, and finally
  implement cancellation & sync queue logic for offline support.
*/

// ─── Sample previous notes — replace with API data later ─────────────────────
const SAMPLE_NOTES = [
  {
    id: 'n1',
    date: "Feb 9, 2026",
    doctor: "Dr. Lee",
    type: "SOAP Note",
    text: "Follow-up for diabetes management...",
    preview: "Follow-up for diabetes management...",
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
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  // notes state (moved from AppointmentForm)
  const [notes, _setNotes] = useState(SAMPLE_NOTES);

  // TODO: Fetch patient details and notes from backend when screen loads.
  // Implement here: GET /api/patients/:id and GET /api/patients/:id/notes
  // Use incoming?.patientId when available. For now we seed notes from SAMPLE_NOTES.
  useEffect(() => {
    // Load remote data when a patientId is available
    if (incoming?.patientId) {
      // Example (to implement):
      // async function load() {
      //   const p = await api.get(`/api/patients/${incoming.patientId}`);
      //   setPatientState(p.data);
      //   const r = await api.get(`/api/patients/${incoming.patientId}/notes`);
      //   _setNotes(r.data);
      // }
      // load();

      // For the mock mode we keep SAMPLE_NOTES initialized in state; when backend is added,
      // replace this with an API call and call _setNotes with fetched notes.
    }
  }, [incoming?.patientId]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleFieldChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }

  function handleSaveAndSync() {
    // TODO: implement save flow
    // - Validate form (no past dates, duration reasonable)
    // - Call backend API: POST (create) or PUT (update) to /api/appointments
    // - Implement optimistic UI update and handle conflict / validation errors
    // - Add to sync queue if offline and schedule background sync
    console.log("Saving appointment (TODO: call backend API):", formData);
    // Example implementation outline:
    // try { await api.put(`/api/appointments/${incoming.id}`, formData); navigate(-1); } catch (err) { showError(err); }
    // Clear dirty state and navigate back
    setIsDirty(false);
    navigate(-1);
  }

  function handleBackClick() {
    if (isDirty) {
      setShowUnsavedModal(true);
      return;
    }

    navigate(-1);
  }

  function handleCancelConfirm() {
    // TODO: implement cancel appointment API call
    // - POST /api/appointments/:id/cancel or PATCH status = 'Cancelled'
    // - Optimistically update UI and record cancellation in audit/sync queue
    console.log("Appointment cancelled (TODO: call backend API)");
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

  // TODO: When saving or cancelling, include audit metadata: user id, timestamp,
  // and if applicable an offline sync token so operations can be reconciled later.

  // Mock patient data (prefer incoming fields if present)
  const patient = {
    id: incoming?.patientId ?? 'P-0001',
    name: incoming?.patientName ?? 'Robert Brown',
    age: incoming?.age ?? 42,
    gender: incoming?.gender ?? 'M',
    dob: incoming?.dob ?? '1983-07-12',
    phone: incoming?.phone ?? '(555) 987-6543',
    lastVisit: incoming?.lastVisit ?? 'Mar 5, 2026',
  };

  return (
    <div style={styles.screen}>
      {/* ── Header ── */}
      <TopHeader title="Edit Appointment" onBack={handleBackClick} />

      {/* ── Scrollable body ── */}
      <div style={styles.body}>

        {/* Patient info card — use PatientInfoCard (mock data if none) */}
        <PatientInfoCard patient={patient} style={{ marginBottom: 0 }} />

        {/* Appointment form */}
        <AppointmentForm
          formData={formData}
          onChange={handleFieldChange}
        />

        {/* Notes section (separate from the form) */}
        <div style={{ marginBottom: 8 }}>
          {/* Add note navigates to Clinical Note screen for this patient */}
          <AddNoteButton
            onClick={() => navigate(`/clinical-note?patientId=${patient.id}`)}
            style={{
              marginBottom: 8,
              border: `1.5px solid ${theme.colors.oscarBlue}`,
              color: theme.colors.oscarBlue,
              backgroundColor: theme.colors.oscarWhite,
            }}
            iconColor={theme.colors.oscarBlue}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notes.map((n) => (
              <NoteCard
                key={n.id}
                note={{ ...n, title: n.type ?? 'SOAP Note', preview: n.preview ?? n.text }}
                onClick={() => navigate(`/clinical-note?patientId=${patient.id}&noteId=${n.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
      </div>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <CancelConfirmModal
          appointment={appointmentForModal}
          onConfirm={handleCancelConfirm}
          onDismiss={() => setShowCancelModal(false)}
        />
      )}

      <UnsavedChangesModal
        open={showUnsavedModal}
        onDismiss={() => setShowUnsavedModal(false)}
        onDiscard={() => {
          setShowUnsavedModal(false);
          setIsDirty(false);
          navigate(-1);
        }}
      />
    </div>
  );
}

const styles = {
  screen: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: theme.colors.oscarGray,
    fontFamily: theme.font.family,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    background: theme.colors.oscarWhite,
    borderBottom: `1px solid ${theme.colors.oscarWhite}`,
    flexShrink: 0,
  },
  backBtn: {
    background: "none",
    border: "none",
    fontSize: 20,
    color: theme.colors.oscarBlue,
    cursor: "pointer",
    padding: 0,
    width: 32,
    fontFamily: theme.font.family,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.oscarBlack,
    fontFamily: theme.font.family,
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
    background: theme.colors.oscarWhite,
    borderRadius: theme.radius.md,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.oscarBlack,
    margin: 0,
    fontFamily: theme.font.family,
  },
  patientMeta: {
    fontSize: 13,
    color: theme.colors.paleSky,
    margin: 0,
    fontFamily: theme.font.family,
  },
  saveBtn: {
    width: "100%",
    padding: "15px 0",
    background: theme.colors.oscarBlue,
    color: theme.colors.oscarWhite,
    border: "none",
    borderRadius: theme.radius.md,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: theme.font.family,
  },
  cancelApptBtn: {
    width: "100%",
    padding: "15px 0",
    background: theme.colors.oscarRed,
    color: theme.colors.oscarWhite,
    border: "none",
    borderRadius: theme.radius.md,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: theme.font.family,
    marginBottom: 0,
  },
};