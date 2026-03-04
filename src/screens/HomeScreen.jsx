import { useNavigate } from "react-router-dom";

/**
 * Home Screen Component
 * Main dashboard for healthcare providers displaying:
 * - Welcome message with doctor's name
 * - Patient search functionality
 * - Today's schedule overview with appointment types and statuses
 * - Recent patients with quick access to patient records
 * - Navigation to profile, schedule, and patient summary screens
 * - Appointment type color coding (Follow-up: #0056B3, New Patient: #816300, Physical: #5F0088, etc.)
 * - Status indicators (Finished: green checkmark, Scheduled: gray dot, Cancelled: red cross)
 */
const HomeScreen = () => {
  const navigate = useNavigate();

  // Placeholder for recent patients data - using mockup data from patients screen
  const recentPatients = [
    { id: "P-0021", name: "Sarah Johnson", time: "2h ago" },
    { id: "P-0022", name: "Michael Chen", time: "yesterday" },
    { id: "P-0023", name: "Emily Rodriguez", time: "yesterday" },
  ];

  // Appointment type color mapping
  const appointmentTypeColors = {
    "New Patient": "#816300",
    "Follow-up": "#0056B3",
    "Physical": "#5F0088",
    "Consultation": "#930076",
    "Urgent Care": "#470007",
  };

  // Function to get appointment type style
  const getAppointmentTypeStyle = (type, status) => {
    const baseStyle = {
      fontSize: "12px",
      color: appointmentTypeColors[type] || "#007AFF",
      margin: "0",
      lineHeight: "1.2",
    };
    
    // Add strikethrough and transparency for cancelled appointments
    if (status === "Cancelled") {
      return {
        ...baseStyle,
        textDecoration: "line-through",
        opacity: 0.6,
      };
    }
    
    return baseStyle;
  };

  // Function to get patient name style for cancelled appointments
  const getPatientNameStyle = (status) => {
    const baseStyle = {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#000000",
      margin: "0 0 2px 0",
      lineHeight: "1.2",
    };
    
    if (status === "Cancelled") {
      return {
        ...baseStyle,
        textDecoration: "line-through",
        opacity: 0.6,
      };
    }
    
    return baseStyle;
  };

  // Function to navigate to patient summary page
  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}/summary`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome, Dr. Lee</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={styles.profileIcon}
          onClick={() => navigate("/profile")}
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </header>

      {/* Search Bar */}
      <div style={styles.searchBarContainer}>
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
          style={styles.searchBar}
        />
      </div>

      {/* Today's Schedule */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.titleWithDate}>
            <h2 style={styles.sectionTitle}>Today's Schedule</h2>
            <span style={styles.dateText}>Mar 4, 2026</span>
          </div>
          <span style={styles.viewAll} onClick={() => navigate("/schedule")}>View All</span>
        </div>
        <div style={styles.scheduleList}>
          <div style={styles.scheduleItem} onClick={() => navigate("/schedule")}>
            <span style={styles.time}>09:00 AM</span>
            <div style={styles.scheduleDetails}>
              <p style={getPatientNameStyle("Finished")}>Jane Doe</p>
              <p style={getAppointmentTypeStyle("Follow-up", "Finished")}>Follow-up</p>
            </div>
            <div style={styles.statusContainer}>
              <span style={styles.checkIcon}>✓</span>
              <span style={styles.statusFinished}>Finished</span>
            </div>
          </div>
          <div style={styles.scheduleItem} onClick={() => navigate("/schedule")}>
            <span style={styles.time}>11:00 AM</span>
            <div style={styles.scheduleDetails}>
              <p style={getPatientNameStyle("Scheduled")}>Jane Doe</p>
              <p style={getAppointmentTypeStyle("New Patient", "Scheduled")}>New Patient</p>
            </div>
            <div style={styles.statusContainer}>
              <span style={styles.dot}>•</span>
              <span style={styles.statusScheduled}>Scheduled</span>
            </div>
          </div>
          <div style={styles.scheduleItem} onClick={() => navigate("/schedule")}>
            <span style={styles.time}>01:00 PM</span>
            <div style={styles.scheduleDetails}>
              <p style={getPatientNameStyle("Scheduled")}>Jane Doe</p>
              <p style={getAppointmentTypeStyle("Physical", "Scheduled")}>Physical</p>
            </div>
            <div style={styles.statusContainer}>
              <span style={styles.dot}>•</span>
              <span style={styles.statusScheduled}>Scheduled</span>
            </div>
          </div>
          <div style={{...styles.scheduleItem, borderBottom: "none"}} onClick={() => navigate("/schedule")}>
            <span style={styles.time}>02:10 PM</span>
            <div style={styles.scheduleDetails}>
              <p style={getPatientNameStyle("Cancelled")}>Jane Doe</p>
              <p style={getAppointmentTypeStyle("Follow-up", "Cancelled")}>Follow-up</p>
            </div>
            <div style={styles.statusContainer}>
              <span style={styles.cancelIcon}>✕</span>
              <span style={styles.statusCancelled}>Cancelled</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Patients */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Patients</h2>
        <div style={styles.patientList}>
          {recentPatients.map((patient) => (
            <div
              key={patient.id}
              style={styles.patientItem}
              onClick={() => handlePatientClick(patient.id)}
            >
              <div style={styles.patientInfo}>
                <p style={styles.patientName}>{patient.name}</p>
                <p style={styles.patientDetails}>
                  ID: {patient.id} • {patient.time}
                </p>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={styles.arrowIcon}
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="#8E8E93"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#F5F5F5",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000000",
  },
  profileIcon: {
    width: "24px",
    height: "24px",
    color: "#000000",
    cursor: "pointer",
  },
  searchBarContainer: {
    position: "relative",
    marginBottom: "20px",
  },
  searchBar: {
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
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#000000",
    margin: "0",
    display: "inline",
  },
  titleWithDate: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
  },
  dateText: {
    fontSize: "14px",
    color: "#8E8E93",
    fontWeight: "normal",
  },
  viewAll: {
    fontSize: "14px",
    color: "#007AFF",
    cursor: "pointer",
  },
  scheduleList: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F9F9F9",
    borderRadius: "8px",
    overflow: "hidden",
  },
  scheduleItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#F9F9F9",
    cursor: "pointer",
    minHeight: "60px",
    borderBottom: "1px solid #E0E0E0",
  },
  time: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#000000",
    minWidth: "70px",
    textAlign: "left",
  },
  scheduleDetails: {
    flex: 1,
    marginLeft: "12px",
    marginRight: "12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  patientName: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#000000",
    margin: "0 0 2px 0",
    lineHeight: "1.3",
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minWidth: "80px",
    justifyContent: "flex-end",
  },
  statusFinished: {
    fontSize: "12px",
    color: "#28A745",
  },
  statusScheduled: {
    fontSize: "12px",
    color: "#6C757D",
  },
  statusCancelled: {
    fontSize: "12px",
    color: "#DC3545",
  },
  checkIcon: {
    fontSize: "14px",
    color: "#28A745",
  },
  dot: {
    fontSize: "16px",
    color: "#6C757D",
  },
  cancelIcon: {
    fontSize: "14px",
    color: "#DC3545",
  },
  patientList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  patientItem: {
    padding: "12px 16px",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    backgroundColor: "#F9F9F9",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "60px",
  },
  patientInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  patientDetails: {
    fontSize: "12px",
    color: "#666666",
    margin: "0",
    lineHeight: "1.3",
  },
  arrowIcon: {
    flexShrink: 0,
  },
};

export default HomeScreen;