import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      <div style={styles.header}>
        <h1 style={styles.title}>Patient List</h1>
      </div>

      <div style={styles.content}>
        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <svg
            style={styles.searchIcon}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
              stroke="#8E8E93"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search patients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

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
    backgroundColor: "#E8E8E8",
    minHeight: "calc(100vh - 80px)",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    borderBottom: "1px solid #E0E0E0",
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
    marginBottom: "24px",
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
    fontSize: "16px",
    border: "1px solid #D1D1D6",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    boxSizing: "border-box",
    outline: "none",
    color: "#000000",
  },
  patientsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  patientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  patientName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#000000",
    margin: "0 0 8px 0",
  },
  patientId: {
    fontSize: "13px",
    color: "#8E8E93",
    margin: "0 0 4px 0",
  },
  patientInfo: {
    fontSize: "13px",
    color: "#8E8E93",
    margin: "0 0 4px 0",
  },
  lastVisit: {
    fontSize: "13px",
    color: "#8E8E93",
    margin: "8px 0 0 0",
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

export default PatientsScreen;
