import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import PatientInfoCard from "../components/patient/PatientInfoCard";
import FormSection from "../components/common/FormSection.jsx";
import { TextInput, SelectInput, TextAreaInput, CheckboxInput, FormLabel } from "../components/common/FormControls";
import UnsavedChangesModal from "../components/common/UnsavedChangesModal";
import theme from "../styles/theme";

/**
 * Clinical Note Screen Component
 * SOAP note format (Subjective, Objective, Assessment, Plan)
 * Supports both creating new notes and editing existing ones
 *
 * URL params:
 * - patientId: The patient this note belongs to (patientNumber e.g. P-0021)
 * - noteId: (optional) If provided, loads existing note for editing
 */
const ClinicalNoteScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const noteId    = searchParams.get("noteId");
  const isEditMode = !!noteId;

  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Form state — Subjective
  const [chiefComplaint,        setChiefComplaint]        = useState("");
  const [subjectiveDescription, setSubjectiveDescription] = useState("");

  // Form state — Objective
  const [bloodPressure,        setBloodPressure]        = useState("");
  const [heartRate,            setHeartRate]            = useState("");
  const [temperature,          setTemperature]          = useState("");
  const [weight,               setWeight]               = useState("");
  const [objectiveDescription, setObjectiveDescription] = useState("");

  // Form state — Assessment
  const [diagnosisCategory, setDiagnosisCategory] = useState("");
  const [clinicalAssessment, setClinicalAssessment] = useState("");

  // Form state — Plan
  const [treatmentPlan,        setTreatmentPlan]        = useState("");
  const [medicationPrescribed, setMedicationPrescribed] = useState(false);
  const [labTestOrdered,       setLabTestOrdered]       = useState(false);
  const [referralMade,         setReferralMade]         = useState(false);
  const [followUpRequired,     setFollowUpRequired]     = useState(false);

  const onChangeVal     = (setter) => (e) => { setter(e.target.value);   setIsDirty(true); };
  const onChangeChecked = (setter) => (e) => { setter(e.target.checked); setIsDirty(true); };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch patient data
      if (patientId) {
        try {
          const r = await fetch(`/api/patients/${patientId}`);
          if (r.ok) {
            const p = await r.json();
            setPatientData({ id: p.id, name: p.name, age: p.age, gender: p.gender, dob: p.dob, phone: p.phone });
          }
        } catch { /* ignore */ }
      }

      // If editing, fetch existing note
      if (isEditMode) {
        try {
          const r = await fetch(`/api/notes/${noteId}`);
          if (r.ok) {
            const n = await r.json();
            setChiefComplaint(n.chiefComplaint       || "");
            setSubjectiveDescription(n.subjectiveDescription || "");
            setBloodPressure(n.bloodPressure         || "");
            setHeartRate(n.heartRate                 || "");
            setTemperature(n.temperature             || "");
            setWeight(n.weight                       || "");
            setObjectiveDescription(n.objectiveDescription || "");
            setDiagnosisCategory(n.diagnosisCategory || "");
            setClinicalAssessment(n.clinicalAssessment || "");
            setTreatmentPlan(n.treatmentPlan         || "");
            setMedicationPrescribed(!!n.medicationPrescribed);
            setLabTestOrdered(!!n.labTestOrdered);
            setReferralMade(!!n.referralMade);
            setFollowUpRequired(!!n.followUpRequired);
          }
        } catch { /* ignore */ }
      }

      setLoading(false);
    };

    fetchData();
  }, [patientId, noteId, isEditMode]);

  const handleBackClick = () => {
    if (isDirty) { setShowConfirmModal(true); return; }
    navigate(-1);
  };

  const handleSaveAndSync = async () => {
    const noteData = {
      patientId,
      chiefComplaint,
      subjectiveDescription,
      bloodPressure,
      heartRate,
      temperature,
      weight,
      objectiveDescription,
      diagnosisCategory,
      clinicalAssessment,
      treatmentPlan,
      medicationPrescribed,
      labTestOrdered,
      referralMade,
      followUpRequired,
    };

    try {
      const url    = isEditMode ? `/api/notes/${noteId}` : '/api/notes';
      const method = isEditMode ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });
    } catch { /* ignore network errors in demo */ }

    setIsDirty(false);
    navigate(-1);
  };

  const handleCancel = () => {
    if (isDirty) { setShowConfirmModal(true); return; }
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <TopHeader
        title="Clinical Note"
        onBack={handleBackClick}
        right={<span style={styles.draftBadge}>Draft</span>}
      />

      <div style={styles.content}>
        {patientData && (
          <PatientInfoCard patient={{ id: patientData.id, name: patientData.name, dob: patientData.dob, age: patientData.age, gender: patientData.gender, phone: patientData.phone }} />
        )}

        <FormSection title="S - Subjective">
          <div style={{ marginBottom: 8 }}>
            <FormLabel>Chief Complaint Category</FormLabel>
            <SelectInput value={chiefComplaint} onChange={onChangeVal(setChiefComplaint)}>
              <option value="">Select Category</option>
              <option value="Diabetes Management">Diabetes Management</option>
              <option value="Hypertension">Hypertension</option>
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Acute Illness">Acute Illness</option>
              <option value="Follow-up">Follow-up</option>
            </SelectInput>
          </div>
          <div>
            <FormLabel>Patient's Description</FormLabel>
            <TextAreaInput value={subjectiveDescription} onChange={onChangeVal(setSubjectiveDescription)} placeholder="Patient reports..." />
          </div>
        </FormSection>

        <FormSection title="O - Objective">
          <div style={styles.vitalsGrid}>
            <div style={styles.inputGroup}>
              <FormLabel>Blood Pressure</FormLabel>
              <TextInput value={bloodPressure} onChange={onChangeVal(setBloodPressure)} placeholder="120/80" />
            </div>
            <div style={styles.inputGroup}>
              <FormLabel>Heart Rate</FormLabel>
              <TextInput value={heartRate} onChange={onChangeVal(setHeartRate)} placeholder="72" />
            </div>
            <div style={styles.inputGroup}>
              <FormLabel>Temperature (°C)</FormLabel>
              <TextInput value={temperature} onChange={onChangeVal(setTemperature)} placeholder="36.7" />
            </div>
            <div style={styles.inputGroup}>
              <FormLabel>Weight (kg)</FormLabel>
              <TextInput value={weight} onChange={onChangeVal(setWeight)} placeholder="68" />
            </div>
          </div>
          <FormLabel>Patient's Description</FormLabel>
          <TextAreaInput value={objectiveDescription} onChange={onChangeVal(setObjectiveDescription)} placeholder="Patient reports..." />
        </FormSection>

        <FormSection title="A - Assessment">
          <div style={{ marginBottom: 8 }}>
            <FormLabel>Diagnosis Category</FormLabel>
            <SelectInput value={diagnosisCategory} onChange={onChangeVal(setDiagnosisCategory)}>
              <option value="">Select Category</option>
              <option value="Type 2 Diabetes">Type 2 Diabetes</option>
              <option value="Hypertension">Hypertension</option>
              <option value="Hyperlipidemia">Hyperlipidemia</option>
              <option value="Upper Respiratory Infection">Upper Respiratory Infection</option>
              <option value="Other">Other</option>
            </SelectInput>
          </div>
          <div>
            <FormLabel>Clinical Assessment</FormLabel>
            <TextAreaInput value={clinicalAssessment} onChange={onChangeVal(setClinicalAssessment)} placeholder="Clinical impression and diagnosis..." />
          </div>
        </FormSection>

        <FormSection title="P - Plan">
          <FormLabel>Treatment Plan</FormLabel>
          <TextAreaInput value={treatmentPlan} onChange={onChangeVal(setTreatmentPlan)} placeholder="Treatment Plan Details..." />
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <CheckboxInput checked={medicationPrescribed} onChange={onChangeChecked(setMedicationPrescribed)} />
              Medication prescribed
            </label>
            <label style={styles.checkboxLabel}>
              <CheckboxInput checked={labTestOrdered} onChange={onChangeChecked(setLabTestOrdered)} />
              Lab test ordered
            </label>
            <label style={styles.checkboxLabel}>
              <CheckboxInput checked={referralMade} onChange={onChangeChecked(setReferralMade)} />
              Referral made
            </label>
            <label style={styles.checkboxLabel}>
              <CheckboxInput checked={followUpRequired} onChange={onChangeChecked(setFollowUpRequired)} />
              Follow-up required
            </label>
          </div>
        </FormSection>

        <button style={styles.saveButton} onClick={handleSaveAndSync}>
          Save & Sync
        </button>
        <button style={styles.cancelButton} onClick={handleCancel}>
          Cancel
        </button>

        <UnsavedChangesModal
          open={showConfirmModal}
          onDismiss={() => setShowConfirmModal(false)}
          onDiscard={() => {
            setShowConfirmModal(false);
            setIsDirty(false);
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: theme.colors.oscarGray,
    fontFamily: theme.font.family,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
  },
  draftBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.colors.paleSky,
    backgroundColor: theme.colors.oscarGray,
    padding: '4px 12px',
    borderRadius: '12px',
  },
  vitalsGrid:    { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 8 },
  inputGroup:    { display: 'flex', flexDirection: 'column' },
  checkboxGroup: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 },
  checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: 14, color: theme.colors.oscarBlack, cursor: 'pointer' },
  saveButton: {
    width: '100%', padding: '16px', fontSize: 15, fontWeight: 600,
    color: theme.colors.oscarWhite, backgroundColor: theme.colors.oscarBlue,
    border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 12,
  },
  cancelButton: {
    width: '100%', padding: '16px', fontSize: 15, fontWeight: 600,
    color: theme.colors.paleSky, backgroundColor: theme.colors.oscarWhite,
    border: `1px solid ${theme.colors.oscarGray}`, borderRadius: 8, cursor: 'pointer',
  },
  loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' },
  loadingText:      { fontSize: 16, color: theme.colors.paleSky },
};

export default ClinicalNoteScreen;
