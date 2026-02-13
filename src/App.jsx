import { Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import PatientsScreen from "./screens/PatientsScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import ChatScreen from "./screens/ChatScreen";
import BottomTab from "./components/BottomTab";

function App() {
  return (
    <div style={styles.appContainer}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/patients" element={<PatientsScreen />} />
        <Route path="/schedule" element={<ScheduleScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>

      <BottomTab />
    </div>
  );
}

const styles = {
  appContainer: {
    maxWidth: "390px",
    margin: "0 auto",
    background: "#f5f5f5",
    minHeight: "100vh",
  },
};

export default App;
