// ─── src/screens/EditAppointmentScreen.jsx ───────────────────────────────────
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

export default function EditAppointmentScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const incoming = location.state?.appointment;

  const [formData, setFormData] = useState({
    type:          incoming?.type          ?? "",
    status:        incoming?.status        ?? "Scheduled",
    date:          incoming?.date          ?? "",
    startTime:     incoming?.startTime     ?? "12:00",
    duration:      incoming?.duration      ?? "30 min",
    reasonForVisit: incoming?.reasonForVisit ?? incoming?.reason ?? "",
  });

  const [patient, setPatient]       = useState(null);
  const [notes, setNotes]           = useState([]);
  const [saving, setSaving]         = useState(false);
  const [showCancelModal, setShowCancelModal]   = useState(false);
  const [isDirty, setIsDirty]                   = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Fetch patient info and notes when we have a patientId
  useEffect(() => {
    const pid = incoming?.patientId;
    if (!pid) return;

    fetch(`/api/patients/${pid}`)
      .then(r => r.json())
      .then(data => setPatient(data))
      .catch(() => {});

    fetch(`/api/patients/${pid}/notes`)
      .then(r => r.json())
      .then(data => setNotes(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [incoming?.patientId]);

  function handleFieldChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }

  async function handleSaveAndSync() {
    if (!incoming?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/appointments/${incoming.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:     formData.type,
          status:   formData.status,
          date:     formData.date,
          startTime: formData.startTime,
          duration: formData.duration,
          reason:   formData.reasonForVisit,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to save appointment');
        return;
      }
      setIsDirty(false);
      navigate(-1);
    } catch {
      alert('Network error — could not save appointment');
    } finally {
      setSaving(false);
    }
  }

  function handleBackClick() {
    if (isDirty) { setShowUnsavedModal(true); return; }
    navigate(-1);
  }

  async function handleCancelConfirm() {
    if (!incoming?.id) { setShowCancelModal(false); navigate(-1); return; }
    try {
      await fetch(`/api/appointments/${incoming.id}/cancel`, { method: 'PATCH' });
    } catch { /* best effort */ }
    setShowCancelModal(false);
    navigate(-1);
  }

  // Use fetched patient or fall back to data from appointment
  const displayPatient = patient ?? {
    id:        incoming?.patientId  ?? '—',
    name:      incoming?.patientName ?? 'Unknown',
    age:       incoming?.age,
    gender:    incoming?.gender,
    dob:       incoming?.dob,
    phone:     incoming?.phone,
    lastVisit: incoming?.lastVisit,
  };

  const appointmentForModal = { ...incoming, ...formData, patientName: displayPatient.name };

  return (
    <div style={styles.screen}>
      <TopHeader title="Edit Appointment" onBack={handleBackClick} />

      <div style={styles.body}>
        <PatientInfoCard patient={displayPatient} style={{ marginBottom: 0 }} />

        <AppointmentForm formData={formData} onChange={handleFieldChange} />

        {/* Notes section */}
        <div style={{ marginBottom: 8 }}>
          <AddNoteButton
            onClick={() => navigate(`/clinical-note?patientId=${displayPatient.id}`)}
            style={{
              marginBottom: 8,
              border: `1.5px solid ${theme.colors.oscarBlue}`,
              color: theme.colors.oscarBlue,
              backgroundColor: theme.colors.oscarWhite,
            }}
            iconColor={theme.colors.oscarBlue}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notes.map(n => (
              <NoteCard
                key={n.id}
                note={{ ...n, title: n.title ?? 'SOAP Note', preview: n.preview }}
                onClick={() => navigate(`/clinical-note?patientId=${displayPatient.id}&noteId=${n.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleSaveAndSync} disabled={saving} style={styles.saveBtn}>
            {saving ? 'Saving…' : 'Save & Sync'}
          </button>
          <button onClick={() => setShowCancelModal(true)} style={styles.cancelApptBtn}>
            Cancel Appointment
          </button>
        </div>
      </div>

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
        onDiscard={() => { setShowUnsavedModal(false); setIsDirty(false); navigate(-1); }}
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
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
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
  },
};
