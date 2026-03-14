import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";

/**
 * Patient Record Summary Screen Component
 * Displays comprehensive patient information including:
 * - Basic patient info (name, ID, age, gender, DOB, phone)
 * - Allergies
 * - Emergency contact
 * - Medical conditions
 * - Current medications
 * - Recent vitals
 */
const PatientRecordSummaryScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");

  // Fetch patient data when component mounts or ID changes
  useEffect(() => {
    // TODO: Replace this with actual data
    const fetchPatientData = async () => {
      setLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Sample patient data - will be replaced with dynamic data (API call)
      const mockPatientData = {
        id: id,
        name: "Sarah Johnson",
        age: 45,
        gender: "Female",
        dob: "Jan 14, 1979",
        phone: "(555) 123-4567",
        allergies: ["Penicillin", "Shellfish"],
        emergencyContact: {
          name: "John Johnson",
          relationship: "Spouse",
          phone: "(555) 987-6543",
        },
        medicalConditions: [
          { condition: "Hypertension", diagnosed: "2020" },
          { condition: "Type 2 Diabetes", diagnosed: "2019" },
        ],
        medications: [
          {
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
          },
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
          },
        ],
        vitals: {
          bloodPressure: { value: "130/85 mmHg", label: "Blood Pressure" },
          heartRate: { value: "72 bpm", label: "Heart Rate" },
          weight: { value: "68 kg", label: "Weight" },
          temperature: { value: "36.7°C", label: "Temperature" },
        },
      };

      setPatientData(mockPatientData);
      setLoading(false);
    };

    fetchPatientData();
  }, [id]); // Re-fetch when patient ID changes

  const handleBackClick = () => {
    navigate("/patients");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Navigate to different patient record screens
    if (tab !== "summary") {
      navigate(`/patient/${id}/${tab}`);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Patient not found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={handleBackClick}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 style={styles.headerTitle}>Patient Record</h1>
        <div style={styles.headerSpacer}></div>
      </div>

      <div style={styles.content}>
        {/* Patient Info Card */}
        <div style={styles.patientInfoCard}>
          <h2 style={styles.patientName}>{patientData.name}</h2>
          <p style={styles.patientDetail}>ID: {patientData.id}</p>
          <p style={styles.patientDetail}>
            {patientData.age} years old • {patientData.gender}
          </p>
          <p style={styles.patientDetail}>DOB: {patientData.dob}</p>
          <p style={styles.patientDetail}>Phone: {patientData.phone}</p>
        </div>

        {/* Allergies Alert */}
        {patientData.allergies && patientData.allergies.length > 0 && (
          <div style={styles.allergiesCard}>
            <div style={styles.allergiesHeader}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={styles.warningIcon}
              >
                <path
                  d="M10 0L0 18h20L10 0zm0 15a1 1 0 100-2 1 1 0 000 2zm0-3a1 1 0 01-1-1V7a1 1 0 012 0v4a1 1 0 01-1 1z"
                  fill="#D4A106"
                />
              </svg>
              <span style={styles.allergiesTitle}>Allergies</span>
            </div>
            <p style={styles.allergiesList}>{patientData.allergies.join(", ")}</p>
          </div>
        )}

        {/* Emergency Contact */}
        {patientData.emergencyContact && (
          <p style={styles.emergencyContact}>
            Emergency Contact: {patientData.emergencyContact.name} (
            {patientData.emergencyContact.relationship}) -{" "}
            {patientData.emergencyContact.phone}
          </p>
        )}

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "summary" ? styles.activeTab : {}),
            }}
            onClick={() => handleTabClick("summary")}
          >
            Summary
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "notes" ? styles.activeTab : {}),
            }}
            onClick={() => handleTabClick("notes")}
          >
            Notes
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "history" ? styles.activeTab : {}),
            }}
            onClick={() => handleTabClick("history")}
          >
            History
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "vitals" ? styles.activeTab : {}),
            }}
            onClick={() => handleTabClick("vitals")}
          >
            Vitals
          </button>
        </div>

        {/* Medical Conditions Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Medical Conditions</h3>
          <div style={styles.singleColumnList}>
            {patientData.medicalConditions.map((condition, index) => (
              <div key={index} style={styles.listItem}>
                <p style={styles.itemTitle}>{condition.condition}</p>
                <p style={styles.itemSubtext}>Diagnosed: {condition.diagnosed}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Medications Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Current Medications</h3>
          <div style={styles.singleColumnList}>
            {patientData.medications.map((medication, index) => (
              <div key={index} style={styles.listItem}>
                <p style={styles.itemTitle}>
                  {medication.name} {medication.dosage}
                </p>
                <p style={styles.itemSubtext}>{medication.frequency}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Vitals Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recent Vitals</h3>
          <div style={styles.vitalsGrid}>
            {Object.values(patientData.vitals).map((vital, index) => (
              <div key={index} style={styles.vitalCard}>
                <p style={styles.vitalLabel}>{vital.label}</p>
                <p style={styles.vitalValue}>{vital.value}</p>
              </div>
            ))}
          </div>
        </div>
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
  },
  headerSpacer: {
    width: "24px",
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
    fontSize: "24px",
    fontWeight: "700",
    color: "#000000",
    margin: "0 0 8px 0",
  },
  patientDetail: {
    fontSize: "14px",
    color: "#666666",
    margin: "4px 0",
  },
  allergiesCard: {
    backgroundColor: "#FFF4E0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    border: "1px solid #F5D98B",
  },
  allergiesHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  warningIcon: {
    marginRight: "8px",
  },
  allergiesTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#D4A106",
  },
  allergiesList: {
    fontSize: "14px",
    color: "#000000",
    margin: "0",
  },
  emergencyContact: {
    fontSize: "13px",
    color: "#666666",
    marginBottom: "20px",
  },
  tabContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
  },
  tab: {
    flex: 1,
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#000000",
    backgroundColor: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  activeTab: {
    backgroundColor: "#007AFF",
    color: "#FFFFFF",
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#000000",
    margin: "0 0 16px 0",
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  singleColumnList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  gridItem: {
    backgroundColor: "#F5F5F5",
    borderRadius: "8px",
    padding: "12px",
  },
  listItem: {
    backgroundColor: "#F5F5F5",
    borderRadius: "8px",
    padding: "12px",
  },
  itemTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
    margin: "0 0 4px 0",
  },
  itemSubtext: {
    fontSize: "13px",
    color: "#666666",
    margin: "0",
  },
  vitalsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  vitalCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
  },
  vitalLabel: {
    fontSize: "13px",
    color: "#666666",
    margin: "0 0 8px 0",
  },
  vitalValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#000000",
    margin: "0",
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
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
  },
  errorText: {
    fontSize: "16px",
    color: "#FF3B30",
  },
};

export default PatientRecordSummaryScreen;
