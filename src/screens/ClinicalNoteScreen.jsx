import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import PatientInfoCard from "../components/patient/PatientInfoCard";
import FormSection from "../components/common/FormSection.jsx";
import { IconAlert } from "../components/common/Icons";
import { TextInput, SelectInput, TextAreaInput, CheckboxInput, FormLabel } from "../components/common/FormControls";
import UnsavedChangesModal from "../components/common/UnsavedChangesModal";
import theme from "../styles/theme";

/**
 * Clinical Note Screen Component
 * SOAP note format (Subjective, Objective, Assessment, Plan)
 * Supports both creating new notes and editing existing ones
 *
 * URL params:
 * - patientId: The patient this note belongs to
 * - noteId: (optional) If provided, loads existing note for editing
 */
const ClinicalNoteScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const noteId = searchParams.get("noteId");
  const isEditMode = !!noteId;

  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Form state - Subjective
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [subjectiveDescription, setSubjectiveDescription] = useState("");

  // Form state - Objective
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [weight, setWeight] = useState("");
  const [objectiveDescription, setObjectiveDescription] = useState("");

  // Form state - Assessment
  const [diagnosisCategory, setDiagnosisCategory] = useState("");
  const [clinicalAssessment, setClinicalAssessment] = useState("");

  // Form state - Plan
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [medicationPrescribed, setMedicationPrescribed] = useState(false);
  const [labTestOrdered, setLabTestOrdered] = useState(false);
  const [referralMade, setReferralMade] = useState(false);
  const [followUpRequired, setFollowUpRequired] = useState(false);

  // Helpers to mark form as dirty when user edits fields
  const onChangeVal = (setter) => (e) => {
    setter(e.target.value);
    setIsDirty(true);
  };

  const onChangeChecked = (setter) => (e) => {
    setter(e.target.checked);
    setIsDirty(true);
  };

  // Load patient data and note data (if editing)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // TODO: Replace with actual data
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Sample patient data - will be replaced with dynamic data (API call)
      const mockPatientData = {
        id: patientId || "P-0021",
        name: "Sarah Johnson",
        age: 45,
        gender: "Female",
        dob: "Jan 14, 1979",
        phone: "(555) 123-4567"
      };

      setPatientData(mockPatientData);

      // If editing, load existing note data
      if (isEditMode) {
        // TODO: Replace with actual data to fetch note by noteId
        const mockNoteData = {
          chiefComplaint: "Diabetes Management",
          subjectiveDescription: "Patient reports feeling dizzy occasionally...",
          bloodPressure: "130/85",
          heartRate: "72",
          temperature: "36.7",
          weight: "68",
          objectiveDescription: "Patient appears alert and oriented...",
          diagnosisCategory: "Type 2 Diabetes",
          clinicalAssessment: "Blood sugar levels are within acceptable range...",
          treatmentPlan: "Continue current medication regimen. Monitor blood sugar daily...",
          medicationPrescribed: true,
          labTestOrdered: true,
          referralMade: false,
          followUpRequired: true,
        };

        setChiefComplaint(mockNoteData.chiefComplaint);
        setSubjectiveDescription(mockNoteData.subjectiveDescription);
        setBloodPressure(mockNoteData.bloodPressure);
        setHeartRate(mockNoteData.heartRate);
        setTemperature(mockNoteData.temperature);
        setWeight(mockNoteData.weight);
        setObjectiveDescription(mockNoteData.objectiveDescription);
        setDiagnosisCategory(mockNoteData.diagnosisCategory);
        setClinicalAssessment(mockNoteData.clinicalAssessment);
        setTreatmentPlan(mockNoteData.treatmentPlan);
        setMedicationPrescribed(mockNoteData.medicationPrescribed);
        setLabTestOrdered(mockNoteData.labTestOrdered);
        setReferralMade(mockNoteData.referralMade);
        setFollowUpRequired(mockNoteData.followUpRequired);
      }

      setLoading(false);
    };

    fetchData();
  }, [patientId, noteId, isEditMode]);

  const handleBackClick = () => {
    if (isDirty) {
      setShowConfirmModal(true);
      return;
    }

    navigate(-1);
  };

  const handleSaveAndSync = () => {
    // TODO: Implement save logic (API call)
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

    console.log(isEditMode ? "Updating note:" : "Creating note:", noteData);

    // Navigate back after save
    setIsDirty(false);
    navigate(-1);
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmModal(true);
      return;
    }

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
      {/* Header */}
      <TopHeader
        title="Clinical Note"
        onBack={handleBackClick}
        right={<span style={styles.draftBadge}>Draft</span>}
      />

      <div style={styles.content}>
        {/* Patient Info Card */}
        {patientData && <PatientInfoCard patient={{ id: patientData.id, name: patientData.name, dob: patientData.dob, age: patientData.age, gender: patientData.gender, phone: patientData.phone }} />}

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

        {/* O - Objective FormSection */}
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

        {/* A - Assessment FormSection */}
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

        {/* P - Plan FormSection */}
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

        {/* Action Buttons */}
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
    backgroundColor: theme.colors.oscarGray,
    height: "100vh",
    paddingBottom: '80px',
  },
  content: { padding: 20, maxWidth: 800, margin: '0 auto' },
  draftBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.colors.paleSky,
    backgroundColor: theme.colors.oscarGray,
    padding: '4px 12px',
    borderRadius: '12px',
  },
  vitalsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 8 },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  checkboxGroup: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 },
  checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: 14, color: theme.colors.oscarBlack, cursor: 'pointer' },
  checkbox: { width: 18, height: 18, marginRight: 10, cursor: 'pointer' },
  saveButton: {
    width: '100%',
    padding: '16px',
    fontSize: 15,
    fontWeight: 600,
    color: theme.colors.oscarWhite,
    backgroundColor: theme.colors.oscarBlue,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    marginBottom: 12,
  },
  cancelButton: {
    width: '100%',
    padding: '16px',
    fontSize: 15,
    fontWeight: 600,
    color: theme.colors.paleSky,
    backgroundColor: theme.colors.oscarWhite,
    border: `1px solid ${theme.colors.oscarGray}`,
    borderRadius: 8,
    cursor: 'pointer',
  },
  loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' },
  loadingText: { fontSize: 16, color: theme.colors.paleSky },
};

export default ClinicalNoteScreen;
