import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Patient Record Vitals Screen Component
 * Displays patient's vital signs measurements history
 * Shows patient info, allergies, and a chronological list of vital measurements
 */
const PatientRecordVitalsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [vitalRecords, setVitalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("vitals");

  // Fetch patient data and vital records when component mounts or ID changes
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
      };

      // Sample vital records data - will be replaced with dynamic data (API call)
      const mockVitalRecords = [
        {
          id: "1",
          date: "Feb 9, 2026",
          bloodPressure: "130/85",
          heartRate: "72",
          weight: "68kg",
          temperature: "36.7°C",
        },
        {
          id: "2",
          date: "Feb 9, 2026",
          bloodPressure: "130/85",
          heartRate: "72",
          weight: "68kg",
          temperature: "36.7°C",
        },
        {
          id: "3",
          date: "Feb 9, 2026",
          bloodPressure: "130/85",
          heartRate: "72",
          weight: "68kg",
          temperature: "36.7°C",
        },
        {
          id: "4",
          date: "Jan 28, 2026",
          bloodPressure: "128/82",
          heartRate: "75",
          weight: "69kg",
          temperature: "36.8°C",
        },
        {
          id: "5",
          date: "Jan 15, 2026",
          bloodPressure: "132/88",
          heartRate: "70",
          weight: "67kg",
          temperature: "36.6°C",
        },
      ];

      setPatientData(mockPatientData);
      setVitalRecords(mockVitalRecords);
      setLoading(false);
    };

    fetchPatientData();
  }, [id]);

  const handleBackClick = () => {
    navigate("/patients");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "summary") {
      navigate(`/patient/${id}/summary`);
    } else if (tab === "notes") {
      navigate(`/patient/${id}/notes`);
    } else if (tab === "history") {
      navigate(`/patient/${id}/history`);
    }
  };

  const handleVitalRecordClick = (recordId) => {
    // TODO: Navigate to vital record detail screen
    console.log("Clicked vital record:", recordId);
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

        {/* Recent Measurements Section */}
        <h3 style={styles.sectionTitle}>Recent Measurements</h3>

        {/* Vital Records List */}
        <div style={styles.vitalsList}>
          {vitalRecords.length === 0 ? (
            <div style={styles.emptyContainer}>
              <p style={styles.emptyText}>No vital records available</p>
            </div>
          ) : (
            vitalRecords.map((record) => (
              <div
                key={record.id}
                style={styles.vitalCard}
                onClick={() => handleVitalRecordClick(record.id)}
              >
                <p style={styles.vitalDate}>{record.date}</p>
                <p style={styles.vitalMeasurements}>
                  BP: {record.bloodPressure}, HR: {record.heartRate}, Weight:{" "}
                  {record.weight}, Temp: {record.temperature}
                </p>
              </div>
            ))
          )}
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
    marginBottom: "20px",
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
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#000000",
    margin: "0 0 16px 0",
  },
  vitalsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  vitalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: "16px",
    cursor: "pointer",
    transition: "box-shadow 0.2s",
  },
  vitalDate: {
    fontSize: "14px",
    color: "#666666",
    margin: "0 0 8px 0",
  },
  vitalMeasurements: {
    fontSize: "14px",
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
  emptyContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#8E8E93",
  },
};

export default PatientRecordVitalsScreen;
