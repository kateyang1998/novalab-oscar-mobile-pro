import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import SearchBar from "../components/common/SearchBar";
import theme from "../styles/theme";
import PatientGrid from "../components/patient/PatientGrid";

/**
 * Patients Screen Component
 * Displays a searchable list of patients with their basic information
 * Shows patient cards in a 2-column grid layout
 */
const PatientsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery ?? "");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}/summary`);
  };

  useEffect(() => {
    setLoading(true);
    fetch('/api/patients')
      .then(r => r.json())
      .then(data => {
        setPatients(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setPatients([]);
        setLoading(false);
      });
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.id.toLowerCase().includes(query) ||
      (patient.gender && patient.gender.toLowerCase().includes(query))
    );
  });

  return (
    <div style={styles.container}>
      <TopHeader title="Patient List" showBack={false} />

      <div className="container" style={styles.content}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search patients by name or ID" />

        {loading && (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading patients...</p>
          </div>
        )}

        {!loading && filteredPatients.length === 0 && (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyText}>
              {searchQuery ? "No patients found" : "No patients available"}
            </p>
          </div>
        )}

        {!loading && filteredPatients.length > 0 && (
          <PatientGrid patients={filteredPatients} onPatientClick={handlePatientClick} />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: theme.colors.oscarGray,
    minHeight: "100vh",
    paddingBottom: "80px",
  },
  content: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
  },
  loadingText: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.paleSky,
  },
  emptyContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
  },
  emptyText: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.paleSky,
  },
};

export default PatientsScreen;
