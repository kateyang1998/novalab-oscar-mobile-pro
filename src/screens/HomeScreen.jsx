import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconUser } from "../components/common/Icons";
import theme from "../styles/theme";
import SearchBar from "../components/common/SearchBar";
import ScheduleToday from "../components/home/ScheduleToday";
import RecentPatients from "../components/home/RecentPatients";

/**
 * Home Screen Component
 * Main dashboard for healthcare providers displaying:
 * - Welcome message with doctor's name
 * - Patient search functionality
 * - Today's schedule overview with appointment types and statuses
 * - Recent patients with quick access to patient records
 */
const HomeScreen = () => {
  const navigate = useNavigate();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [clinician, setClinician] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Compute today's date string and display label
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().slice(0, 10);
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const displayDate = `${MONTHS[todayDate.getMonth()]} ${todayDate.getDate()}, ${todayDate.getFullYear()}`;

  // Helper: compute relative time string from an ISO date string
  function relativeTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  }

  useEffect(() => {
    // Fetch today's appointments
    fetch('/api/appointments/today')
      .then(r => r.json())
      .then(data => setTodayAppointments(Array.isArray(data) ? data : []))
      .catch(() => setTodayAppointments([]));

    // Fetch patients to derive recent patients (sorted by lastVisit)
    fetch('/api/patients')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const recent = data
          .filter(p => p.lastVisitDate)
          .sort((a, b) => b.lastVisitDate.localeCompare(a.lastVisitDate))
          .slice(0, 3)
          .map(p => ({ id: p.id, name: p.name, time: relativeTime(p.lastVisitDate) }));
        setRecentPatients(recent);
      })
      .catch(() => setRecentPatients([]));

    // Fetch current clinician
    fetch('/api/clinician')
      .then(r => r.json())
      .then(data => setClinician(data))
      .catch(() => {});
  }, []);

  return (
    <div style={{ ...styles.container, backgroundColor: theme.colors.oscarGray }}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome, {clinician ? clinician.name : 'Dr. Lee'}</h1>
        <div style={styles.profileIcon} onClick={() => navigate("/profile")}>
          <IconUser size={24} color={theme.colors.oscarBlack} />
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSubmit={(q) => navigate('/patients', { state: { searchQuery: q } })}
      />

      {/* Today's Schedule */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.titleWithDate}>
            <h2 style={styles.sectionTitle}>Today's Schedule</h2>
            <span style={styles.dateText}>{displayDate}</span>
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
};

export default HomeScreen;
