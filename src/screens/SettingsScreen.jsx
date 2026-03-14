import { useNavigate } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import { useState } from "react";
import BottomTab from "../components/BottomTab";

/**
 * Settings Screen Component
 * Application settings interface displaying:
 * - Security settings (biometric login, auto-lock functionality)
 * - Notification settings (push notifications, appointment reminders)
 * - Data & Sync settings (auto-sync, offline mode)
 * - System settings (help & support, privacy policy)
 * - Navigation back to profile screen
 * - Bottom navigation tab integration
 */
const SettingsScreen = () => {
  const navigate = useNavigate();

  // Settings state management
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleHelpSupport = () => {
    // TODO: Navigate to help & support page
    console.log("Navigate to help & support");
  };

  const handlePrivacyPolicy = () => {
    // TODO: Navigate to privacy policy page
    console.log("Navigate to privacy policy");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={handleBackClick}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 style={styles.headerTitle}>Settings</h1>
        <div style={styles.spacer}></div>
      </div>

      <div style={styles.content}>
        {/* Security Section */}
        <div style={styles.section}>
          <div style={styles.sectionContainer}>
            <div style={styles.sectionTitleContainer}>
              <h3 style={styles.sectionTitle}>Security</h3>
            </div>
            <div style={styles.settingItemFirst}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Biometric Login</span>
                <span style={styles.settingDescription}>Lock app after inactivity</span>
              </div>
              <div
                style={{
                  ...styles.toggleSwitch,
                  backgroundColor: biometricLogin ? "#007AFF" : "#E5E5E7"
                }}
                onClick={() => setBiometricLogin(!biometricLogin)}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    transform: biometricLogin ? "translateX(20px)" : "translateX(2px)"
                  }}
                ></div>
              </div>
            </div>

            <div style={styles.settingItemLast}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Auto-Lock</span>
                <span style={styles.settingDescription}>Lock app after inactivity</span>
              </div>
              <div
                style={{
                  ...styles.toggleSwitch,
                  backgroundColor: autoLock ? "#007AFF" : "#E5E5E7"
                }}
                onClick={() => setAutoLock(!autoLock)}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    transform: autoLock ? "translateX(20px)" : "translateX(2px)"
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div style={styles.section}>
          <div style={styles.sectionContainer}>
            <div style={styles.sectionTitleContainer}>
              <h3 style={styles.sectionTitle}>Notifications</h3>
            </div>
            <div style={styles.settingItemFirst}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Push Notifications</span>
                <span style={styles.settingDescription}>Receive app notifications</span>
              </div>
              <div
                style={{
                  ...styles.toggleSwitch,
                  backgroundColor: pushNotifications ? "#007AFF" : "#E5E5E7"
                }}
                onClick={() => setPushNotifications(!pushNotifications)}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    transform: pushNotifications ? "translateX(20px)" : "translateX(2px)"
                  }}
                ></div>
              </div>
            </div>

            <div style={styles.settingItemLast}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Appointment Reminders</span>
                <span style={styles.settingDescription}>Get notified about upcoming appointments</span>
              </div>
              <div
                style={{
                  ...styles.toggleSwitch,
                  backgroundColor: appointmentReminders ? "#007AFF" : "#E5E5E7"
                }}
                onClick={() => setAppointmentReminders(!appointmentReminders)}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    transform: appointmentReminders ? "translateX(20px)" : "translateX(2px)"
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Data & Sync Section */}
        <div style={styles.section}>
          <div style={styles.sectionContainer}>
            <div style={styles.sectionTitleContainer}>
              <h3 style={styles.sectionTitle}>Data & Sync</h3>
            </div>
            <div style={styles.settingItemFirst}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Auto-sync</span>
                <span style={styles.settingDescription}>Automatically sync when connected</span>
              </div>
              <div
                style={{
                  ...styles.toggleSwitch,
                  backgroundColor: autoSync ? "#007AFF" : "#E5E5E7"
                }}
                onClick={() => setAutoSync(!autoSync)}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    transform: autoSync ? "translateX(20px)" : "translateX(2px)"
                  }}
                ></div>
              </div>
            </div>

            <div style={styles.settingItemLast}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Offline Mode</span>
                <span style={styles.settingDescription}>Allow offline data access</span>
              </div>
              <div
                style={{
                  ...styles.toggleSwitch,
                  backgroundColor: offlineMode ? "#007AFF" : "#E5E5E7"
                }}
                onClick={() => setOfflineMode(!offlineMode)}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    transform: offlineMode ? "translateX(20px)" : "translateX(2px)"
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* System Section */}
        <div style={styles.section}>
          <div style={styles.sectionContainer}>
            <div style={styles.sectionTitleContainer}>
              <h3 style={styles.sectionTitle}>System</h3>
            </div>
            <div style={styles.menuItemFirst} onClick={handleHelpSupport}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Help & Support</span>
                <span style={styles.settingDescription}>Get help and contact support</span>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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

            <div style={styles.menuItemLast} onClick={handlePrivacyPolicy}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Privacy Policy</span>
                <span style={styles.settingDescription}>View our privacy policy</span>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomTab />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#E8E8E8",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #E0E0E0",
  },
  backButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#000000",
    margin: "0",
    flex: 1,
    textAlign: "center",
  },
  spacer: {
    width: "24px",
  },
  content: {
    flex: 1,
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  section: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#000000",
    margin: "0",
  },
  sectionTitleContainer: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px 12px 20px",
  },
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    overflow: "hidden",
  },
  settingItemFirst: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #F0F0F0",
  },
  settingItemLast: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemFirst: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #F0F0F0",
    cursor: "pointer",
  },
  menuItemLast: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  settingItem: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #F0F0F0",
    borderRadius: "8px 8px 0 0",
  },
  settingInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  settingLabel: {
    fontSize: "16px",
    color: "#000000",
    fontWeight: "400",
    marginBottom: "2px",
  },
  settingDescription: {
    fontSize: "14px",
    color: "#8E8E93",
  },
  toggleSwitch: {
    width: "44px",
    height: "26px",
    borderRadius: "13px",
    position: "relative",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  toggleKnob: {
    width: "22px",
    height: "22px",
    backgroundColor: "#FFFFFF",
    borderRadius: "11px",
    position: "absolute",
    top: "2px",
    transition: "transform 0.2s",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  menuItem: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #F0F0F0",
    cursor: "pointer",
    borderRadius: "8px 8px 0 0",
  },
  menuItemNoBorder: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    borderRadius: "0 0 8px 8px",
  },
};

export default SettingsScreen;
