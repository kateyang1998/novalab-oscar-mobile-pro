import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import PatientTopSections from "../components/patient/PatientTopSections";
import TabNav from "../components/patient/TabNav";
import SummaryTab from "../components/patient/tabs/SummaryTab";
import NotesTab from "../components/patient/tabs/NotesTab";
import HistoryTab from "../components/patient/tabs/HistoryTab";
import VitalsTab from "../components/patient/tabs/VitalsTab";
import theme from "../styles/index.js";

const PatientRecordScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/patients/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Patient not found');
        return r.json();
      })
      .then(data => {
        setPatientData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
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

  if (error || !patientData) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error || 'Patient not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <TopHeader title="Patient Record" onBack={handleBackClick} />
      <div style={styles.content}>
        <PatientTopSections patient={patientData} />
        <TabNav activeTab={activeTab} onChange={handleTabClick} />
        <div style={{ marginTop: 8 }}>
          {activeTab === "summary"  && <SummaryTab patientId={id} patient={patientData} />}
          {activeTab === "notes"    && <NotesTab   patientId={id} />}
          {activeTab === "history"  && <HistoryTab patientId={id} />}
          {activeTab === "vitals"   && <VitalsTab  patientId={id} />}
        </div>
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
  loadingContainer: { display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px" },
  loadingText: { fontSize: 16, color: "var(--color-neutral-7)" },
  errorContainer: { display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px" },
  errorText: { fontSize: 16, color: "var(--color-danger)" },
};

export default PatientRecordScreen;
