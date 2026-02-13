import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import PatientsScreen from "./screens/PatientsScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import ChatScreen from "./screens/ChatScreen";
import SplashScreen from "./screens/SplashScreen";
import SignInScreen from "./screens/SignInScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PatientRecordSummaryScreen from "./screens/PatientRecordSummaryScreen";
import PatientRecordNotesScreen from "./screens/PatientRecordNotesScreen";
import PatientRecordHistoryScreen from "./screens/PatientRecordHistoryScreen";
import PatientRecordVitalsScreen from "./screens/PatientRecordVitalsScreen";
import ClinicalNoteScreen from "./screens/ClinicalNoteScreen";
import BottomTab from "./components/BottomTab";

/**
 * Main App Component
 * Handles routing and conditional rendering of bottom tab navigation
 * Navigation flow: / -> /splash (3s) -> /signin -> /home
 */
function App() {
  const location = useLocation();

  // No bottom tab navigation screens
  const routesWithoutBottomTab = ["/splash", "/signin"];
  const shouldShowBottomTab = !routesWithoutBottomTab.includes(location.pathname);

  // No vertical scrolling screens
  const noScrollRoutes = ["/splash", "/signin"];
  const shouldDisableScroll = noScrollRoutes.includes(location.pathname);

  return (
    <div style={{
      ...styles.appContainer,
      paddingBottom: shouldShowBottomTab ? "80px" : "0",
      overflow: shouldDisableScroll ? "hidden" : "auto",
      height: shouldDisableScroll ? "100vh" : "auto",
      minHeight: shouldDisableScroll ? "unset" : "100vh",
    }}>
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/signin" element={<SignInScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/patients" element={<PatientsScreen />} />
        <Route path="/schedule" element={<ScheduleScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/patient/:id/summary" element={<PatientRecordSummaryScreen />} />
        <Route path="/patient/:id/notes" element={<PatientRecordNotesScreen />} />
        <Route path="/patient/:id/history" element={<PatientRecordHistoryScreen />} />
        <Route path="/patient/:id/vitals" element={<PatientRecordVitalsScreen />} />
        <Route path="/clinical-note" element={<ClinicalNoteScreen />} />
      </Routes>

      {shouldShowBottomTab && <BottomTab />}
    </div>
  );
}

const styles = {
  appContainer: {
    width: "100%",
    background: "#f5f5f5",
    minHeight: "100vh",
    position: "relative",
  },
};

export default App;
