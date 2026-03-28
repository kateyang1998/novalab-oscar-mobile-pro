import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import PatientsScreen from "./screens/PatientsScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import EditAppointmentScreen from "./screens/EditAppointmentScreen";
import InboxScreen from "./screens/InboxScreen";
import SplashScreen from "./screens/SplashScreen";
import SignInScreen from "./screens/SignInScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import HelpScreen from "./screens/HelpScreen";
import PatientRecordScreen from "./screens/PatientRecordScreen";
import ClinicalNoteScreen from "./screens/ClinicalNoteScreen";
import BottomTab from "./components/layout/BottomTab";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import theme from './styles/theme';

function App() {
  const location = useLocation();

  const routesWithoutBottomTab = ["/splash", "/signin", "/appointment/edit", "/profile", "/settings", "/patient/", "/clinical-note", "/help"];
  const shouldShowBottomTab = !routesWithoutBottomTab.some((p) => location.pathname === p || location.pathname.startsWith(p));

  const noScrollRoutes = ["/splash", "/signin", "/schedule", "/appointment/edit"];
  const shouldDisableScroll = noScrollRoutes.includes(location.pathname);

  return (
    <div
      data-app-scroll
      style={{
        ...styles.appContainer,
        paddingBottom: shouldShowBottomTab && !shouldDisableScroll ? "80px" : "0",
        overflow: shouldDisableScroll ? "hidden" : "auto",
        height: shouldDisableScroll ? "100vh" : "auto",
        minHeight: shouldDisableScroll ? "unset" : "100vh",
      }}
    >
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/signin" element={<SignInScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/patients" element={<PatientsScreen />} />
        <Route path="/schedule" element={<ScheduleScreen />} />
        <Route path="/appointment/edit" element={<EditAppointmentScreen />} />
        <Route path="/inbox" element={<InboxScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/help" element={<HelpScreen />} />
        <Route path="/patient/:id" element={<PatientRecordScreen />} />
        <Route path="/patient/:id/summary" element={<PatientRecordScreen />} />
        <Route path="/patient/:id/notes" element={<PatientRecordScreen />} />
        <Route path="/patient/:id/history" element={<PatientRecordScreen />} />
        <Route path="/patient/:id/vitals" element={<PatientRecordScreen />} />
        <Route path="/clinical-note" element={<ClinicalNoteScreen />} />
      </Routes>

      {shouldShowBottomTab && <BottomTab />}
    </div>
  );
}

const styles = {
  appContainer: {
    width: "100%",
    background: theme.colors.oscarGray,
    minHeight: "100vh",
    position: "relative",
  },
};

export default App;
