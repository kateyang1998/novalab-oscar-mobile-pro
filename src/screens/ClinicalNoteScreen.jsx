import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
        dateTime: "2026. 2. 11. 11:16 PM",
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
    navigate(-1);
  };

  const handleCancel = () => {
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
        {patientData && (
          <div style={styles.patientInfoCard}>
            <h2 style={styles.patientName}>{patientData.name}</h2>
            <p style={styles.patientDetail}>ID: {patientData.id}</p>
            <p style={styles.patientDetail}>{patientData.dateTime}</p>
          </div>
        )}

        {/* S - Subjective Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>S - Subjective</h3>

          <label style={styles.label}>Chief Complaint Category</label>
          <select
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Category</option>
            <option value="Diabetes Management">Diabetes Management</option>
            <option value="Hypertension">Hypertension</option>
            <option value="Routine Checkup">Routine Checkup</option>
            <option value="Acute Illness">Acute Illness</option>
            <option value="Follow-up">Follow-up</option>
          </select>

          <label style={styles.label}>Patient's Description</label>
          <textarea
            value={subjectiveDescription}
            onChange={(e) => setSubjectiveDescription(e.target.value)}
            placeholder="Patient reports..."
            style={styles.textarea}
          />
        </div>

        {/* O - Objective Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>O - Objective</h3>

          <div style={styles.vitalsGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Blood Pressure</label>
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="120/80"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Heart Rate</label>
              <input
                type="text"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="72"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Temperature (°C)</label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="36.7"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Weight (kg)</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="68"
                style={styles.input}
              />
            </div>
          </div>

          <label style={styles.label}>Patient's Description</label>
          <textarea
            value={objectiveDescription}
            onChange={(e) => setObjectiveDescription(e.target.value)}
            placeholder="Patient reports..."
            style={styles.textarea}
          />
        </div>

        {/* A - Assessment Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>A - Assessment</h3>

          <label style={styles.label}>Diagnosis Category</label>
          <select
            value={diagnosisCategory}
            onChange={(e) => setDiagnosisCategory(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Category</option>
            <option value="Type 2 Diabetes">Type 2 Diabetes</option>
            <option value="Hypertension">Hypertension</option>
            <option value="Hyperlipidemia">Hyperlipidemia</option>
            <option value="Upper Respiratory Infection">Upper Respiratory Infection</option>
            <option value="Other">Other</option>
          </select>

          <label style={styles.label}>Clinical Assessment</label>
          <textarea
            value={clinicalAssessment}
            onChange={(e) => setClinicalAssessment(e.target.value)}
            placeholder="Clinical impression and diagnosis..."
            style={styles.textarea}
          />
        </div>

        {/* P - Plan Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>P - Plan</h3>

          <label style={styles.label}>Treatment Plan</label>
          <textarea
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
            placeholder="Treatment Plan Details..."
            style={styles.textarea}
          />

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={medicationPrescribed}
                onChange={(e) => setMedicationPrescribed(e.target.checked)}
                style={styles.checkbox}
              />
              Medication prescribed
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={labTestOrdered}
                onChange={(e) => setLabTestOrdered(e.target.checked)}
                style={styles.checkbox}
              />
              Lab test ordered
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={referralMade}
                onChange={(e) => setReferralMade(e.target.checked)}
                style={styles.checkbox}
              />
              Referral made
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={followUpRequired}
                onChange={(e) => setFollowUpRequired(e.target.checked)}
                style={styles.checkbox}
              />
              Follow-up required
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <button style={styles.saveButton} onClick={handleSaveAndSync}>
          Save & Sync
        </button>
        <button style={styles.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#E8E8E8",
    minHeight: "100vh",
    paddingBottom: "80px",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #E0E0E0",
  },
  backButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#000000",
    margin: "0",
    flex: 1,
    textAlign: "center",
  },
  draftBadge: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#666666",
    backgroundColor: "#E8E8E8",
    padding: "4px 12px",
    borderRadius: "12px",
  },
  content: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  patientInfoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "16px",
  },
  patientName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#000000",
    margin: "0 0 8px 0",
  },
  patientDetail: {
    fontSize: "13px",
    color: "#666666",
    margin: "4px 0",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#007AFF",
    margin: "0 0 16px 0",
    paddingBottom: "8px",
    borderBottom: "2px solid #007AFF",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
    marginBottom: "8px",
    marginTop: "16px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #D1D1D6",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    boxSizing: "border-box",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #D1D1D6",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    boxSizing: "border-box",
    outline: "none",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #D1D1D6",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    boxSizing: "border-box",
    outline: "none",
    minHeight: "100px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  vitalsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    marginBottom: "8px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "16px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#000000",
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    marginRight: "10px",
    cursor: "pointer",
  },
  saveButton: {
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#FFFFFF",
    backgroundColor: "#007AFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "12px",
  },
  cancelButton: {
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#000000",
    backgroundColor: "#FFFFFF",
    border: "1px solid #D1D1D6",
    borderRadius: "8px",
    cursor: "pointer",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#8E8E93",
  },
};

export default ClinicalNoteScreen;
