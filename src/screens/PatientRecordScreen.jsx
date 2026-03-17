import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import PatientTopSections from "../components/patient/PatientTopSections";
import TabNav from "../components/patient/TabNav";
import SummaryTab from "../components/patient/tabs/SummaryTab";
import NotesTab from "../components/patient/tabs/NotesTab";
import HistoryTab from "../components/patient/tabs/HistoryTab";
import VitalsTab from "../components/patient/tabs/VitalsTab";

const PatientRecordScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 200));
      const mock = {
        id,
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
          { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
          { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
        ],
        vitals: {
          bp: { label: "Blood Pressure", value: "130/85 mmHg" },
          hr: { label: "Heart Rate", value: "72 bpm" },
          weight: { label: "Weight", value: "68 kg" },
          temperature: { label: "Temperature", value: "36.7°C" },
        },
      };
      setPatientData(mock);
      setLoading(false);
    };

    fetchPatient();
  }, [id]);

  const handleBackClick = () => {
    try {
      if (window.history && window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/patients");
      }
    } catch {
      navigate("/patients");
    }
  };

  const getActiveTabFromPath = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "summary";
    if (["summary", "notes", "history", "vitals"].includes(last)) return last;
    return "summary";
  };

  const activeTab = getActiveTabFromPath();

  const handleTabClick = (tab) => {
    // update URL to keep routes deep-linkable
    // Use replace so switching between summary/notes/history/vitals
    // doesn't create new history entries. This ensures the Back button
    // returns to the page the user came from, not to the previous tab.
    navigate(`/patient/${id}/${tab}`, { replace: true });
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
      <TopHeader title="Patient Record" onBack={handleBackClick} />
      <div style={styles.content}>
        {/* Top always visible */}
        <PatientTopSections patient={patientData} />

        {/* Tab navigation (separate component) */}
        <TabNav activeTab={activeTab} onChange={handleTabClick} />

        {/* Child pages */}
        <div style={{ marginTop: 8 }}>
          {activeTab === "summary" && <SummaryTab patientId={id} patient={patientData} />}
          {activeTab === "notes" && <NotesTab patientId={id} />}
          {activeTab === "history" && <HistoryTab patientId={id} />}
          {activeTab === "vitals" && <VitalsTab patientId={id} />}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "var(--color-background)",
    height: "100vh",
    paddingBottom: "80px",
  },
  content: { padding: 20, maxWidth: 800, margin: "0 auto" },
  loadingContainer: { display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px" },
  loadingText: { fontSize: 16, color: "var(--color-neutral-7)" },
  errorContainer: { display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px" },
  errorText: { fontSize: 16, color: "var(--color-danger)" },
};

export default PatientRecordScreen;

