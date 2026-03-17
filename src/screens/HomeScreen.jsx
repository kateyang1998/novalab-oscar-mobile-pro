import { useNavigate } from "react-router-dom";
import { IconUser } from "../components/common/Icons";
import theme from "../styles/theme";
import SearchBar from "../components/common/SearchBar";
import ScheduleToday from "../components/home/ScheduleToday";
import RecentPatients from "../components/home/RecentPatients";
import SAMPLE_APPOINTMENTS from "../data/sampleAppointments";

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

  // (no local helpers required here)

  // derive today's appointments from sample appointments in schedule screen
  // Use the mock date that matches the sample appointments so the Home preview shows items
  const todayStr = '2026-04-15';
  const todayAppointments = (SAMPLE_APPOINTMENTS || []).filter(a => a.date === todayStr).map(a => ({
    id: a.id,
    patientName: a.patientName,
    type: a.type,
    startTime: a.startTime,
    status: a.status,
  }));

  return (
    <div style={{ ...styles.container, backgroundColor: theme.colors.oscarGray }}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome, Dr. Lee</h1>
        <div style={styles.profileIcon} onClick={() => navigate("/profile")}> 
          <IconUser size={24} color={theme.colors.oscarBlack} />
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar />

      {/* Today's Schedule */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.titleWithDate}>
            <h2 style={styles.sectionTitle}>Today's Schedule</h2>
            <span style={styles.dateText}>Apr 15, 2026</span>
          </div>
          <span
            style={styles.viewAll}
            onClick={() => navigate("/schedule", { state: { view: 'day', date: todayStr } })}
          >
            View All
          </span>
        </div>
        <ScheduleToday items={todayAppointments} />
      </section>

      {/* Recent Patients */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Patients</h2>
        <RecentPatients patients={recentPatients} />
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
    backgroundColor: theme.colors.oscarGray,
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
    color: theme.colors.oscarBlack,
  },
  profileIcon: {
    width: "24px",
    height: "24px",
    color: theme.colors.oscarBlack,
    cursor: "pointer",
  },
  searchBarContainer: {
    position: "relative",
    marginBottom: "20px",
  },
  searchBar: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    fontSize: theme.font.sizes.md,
    border: `1px solid ${theme.colors.oscarWhite}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.oscarWhite,
    boxSizing: "border-box",
    outline: "none",
    color: theme.colors.oscarBlack,
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  section: {
    backgroundColor: theme.colors.oscarWhite,
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
    color: theme.colors.oscarBlack,
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
    color: theme.colors.paleSky,
    fontWeight: "normal",
  },
  viewAll: {
    fontSize: "14px",
    color: theme.colors.oscarBlue,
    cursor: "pointer",
  },
  scheduleList: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colors.oscarGray,
    borderRadius: "8px",
    overflow: "hidden",
  },
  scheduleItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: theme.colors.oscarGray,
    cursor: "pointer",
    minHeight: "60px",
    borderBottom: `1px solid ${theme.colors.oscarWhite}`,
  },
  time: {
    fontSize: "14px",
    fontWeight: "bold",
    color: theme.colors.oscarBlack,
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
    color: theme.colors.oscarBlack,
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
    color: theme.colors.oscarGreen,
  },
  statusScheduled: {
    fontSize: "12px",
    color: theme.colors.paleSky,
  },
  statusCancelled: {
    fontSize: "12px",
    color: theme.colors.oscarRed,
  },
  checkIcon: {
    fontSize: "14px",
    color: theme.colors.oscarGreen,
  },
  dot: {
    fontSize: "16px",
    color: theme.colors.paleSky,
  },
  cancelIcon: {
    fontSize: "14px",
    color: theme.colors.oscarRed,
  },
  patientList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  patientItem: {
    padding: "12px 16px",
    border: `1px solid ${theme.colors.oscarWhite}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.oscarWhite,
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
    color: theme.colors.paleSky,
    margin: "0",
    lineHeight: "1.3",
  },
  arrowIcon: {
    flexShrink: 0,
  },
};

export default HomeScreen;
