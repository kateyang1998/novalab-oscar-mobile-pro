import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import SearchBar from "../components/common/SearchBar";
import theme from "../styles/theme";

/**
 * Patients Screen Component
 * Displays a searchable list of patients with their basic information
 * Shows patient cards in a 2-column grid layout
 */
const PatientsScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle patient card click
  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}/summary`);
  };

  // Fetch patients data when component mounts
  useEffect(() => {
    // TODO: Replace this with actual data (maybe API call)
    // Simulating API call with timeout
    const fetchPatients = async () => {
      setLoading(true);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Sample patient data - will be replaced with dynamic data (API call)
      const mockData = [
        {
          id: "P-0021",
          name: "Sarah Johnson",
          age: 45,
          gender: "Female",
          dob: "Jan 14, 1979",
          lastVisit: "Feb 8, 2026",
        },
        {
          id: "P-0022",
          name: "Michael Chen",
          age: 62,
          gender: "Male",
          dob: "Mar 22, 1962",
          lastVisit: "Jan 15, 2026",
        },
        {
          id: "P-0023",
          name: "Emily Rodriguez",
          age: 34,
          gender: "Female",
          dob: "Jul 8, 1990",
          lastVisit: "Feb 10, 2026",
        },
        {
          id: "P-0024",
          name: "James Wilson",
          age: 28,
          gender: "Male",
          dob: "Nov 30, 1996",
          lastVisit: "Feb 5, 2026",
        },
        {
          id: "P-0025",
          name: "Maria Garcia",
          age: 51,
          gender: "Female",
          dob: "Apr 17, 1973",
          lastVisit: "Jan 28, 2026",
        },
        {
          id: "P-0026",
          name: "David Brown",
          age: 39,
          gender: "Male",
          dob: "Sep 3, 1985",
          lastVisit: "Feb 12, 2026",
        },
        {
          id: "P-0027",
          name: "Lisa Anderson",
          age: 47,
          gender: "Female",
          dob: "Dec 11, 1977",
          lastVisit: "Feb 1, 2026",
        },
        {
          id: "P-0028",
          name: "Robert Taylor",
          age: 55,
          gender: "Male",
          dob: "May 25, 1969",
          lastVisit: "Jan 20, 2026",
        },
        {
          id: "P-0029",
          name: "Jennifer Martinez",
          age: 41,
          gender: "Female",
          dob: "Aug 14, 1983",
          lastVisit: "Feb 7, 2026",
        },
        {
          id: "P-0030",
          name: "William Thompson",
          age: 67,
          gender: "Male",
          dob: "Feb 2, 1957",
          lastVisit: "Jan 25, 2026",
        },
      ];

      setPatients(mockData);
      setLoading(false);
    };

    fetchPatients();
  }, []);
  
  // Filter patients based on search query (searches by name, ID, or gender)
  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.id.toLowerCase().includes(query) ||
      patient.gender.toLowerCase().includes(query)
    );
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <TopHeader title="Patient List" showBack={false} />

      <div className="container" style={styles.content}>
        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search patients" />

        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading patients...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPatients.length === 0 && (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyText}>
              {searchQuery ? "No patients found" : "No patients available"}
            </p>
          </div>
        )}

        {/* Patient Cards Grid */}
        {!loading && filteredPatients.length > 0 && (
          <div style={styles.patientsGrid}>
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                style={styles.patientCard}
                onClick={() => handlePatientClick(patient.id)}
              >
                <h3 style={styles.patientName}>{patient.name}</h3>
                <p style={styles.patientId}>ID: {patient.id}</p>
                <p style={styles.patientInfo}>
                  {patient.age} years old • {patient.gender}
                </p>
                <p style={styles.patientInfo}>DOB: {patient.dob}</p>
                <p style={styles.lastVisit}>Last Visit: {patient.lastVisit}</p>
              </div>
            ))}
          </div>
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
  header: {
    backgroundColor: theme.colors.oscarWhite,
    padding: "16px 20px",
    borderBottom: `1px solid ${theme.colors.oscarGray}`,
  },
  content: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    margin: "0",
  },
  searchContainer: {
    position: "relative",
    marginBottom: theme.spacing.lg,
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    fontSize: theme.font.sizes.md,
    border: `1px solid ${theme.colors.oscarGray}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.oscarWhite,
    boxSizing: "border-box",
    outline: "none",
    color: theme.colors.oscarBlack,
  },
  patientsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  patientCard: {
    backgroundColor: theme.colors.oscarWhite,
    borderRadius: theme.radius.md,
    padding: "16px",
    boxShadow: theme.shadows.sm,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  patientName: {
    fontSize: theme.font.sizes.lg,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.oscarBlack,
    margin: "0 0 8px 0",
  },
  patientId: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.paleSky,
    margin: "0 0 4px 0",
  },
  patientInfo: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.paleSky,
    margin: "0 0 4px 0",
  },
  lastVisit: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.paleSky,
    margin: "8px 0 0 0",
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
