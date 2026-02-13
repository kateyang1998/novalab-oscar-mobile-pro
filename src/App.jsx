import { Routes, Route, useLocation } from "react-router-dom";
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

function App() {
  const location = useLocation();

  // Routes that should NOT show the bottom tab
  const routesWithoutBottomTab = ["/splash", "/signin"];
  const shouldShowBottomTab = !routesWithoutBottomTab.includes(location.pathname);

  return (
    <div style={{
      ...styles.appContainer,
      paddingBottom: shouldShowBottomTab ? "80px" : "0",
    }}>
      <Routes>
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/signin" element={<SignInScreen />} />
        <Route path="/" element={<HomeScreen />} />
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
