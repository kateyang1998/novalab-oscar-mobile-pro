import { useNavigate } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import { useState } from "react";
import theme from '../styles/theme';
import SettingSection from '../components/settings/SettingSection';
import SettingRow from '../components/settings/SettingRow';

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
      <TopHeader title="Settings" onBack={handleBackClick} />

      <div style={styles.content}>
        <SettingSection title="Security">
          <SettingRow label="Biometric Login" description="Lock app after inactivity" showToggle toggleOn={biometricLogin} onToggle={() => setBiometricLogin(!biometricLogin)} first />
          <SettingRow label="Auto-Lock" description="Lock app after inactivity" showToggle toggleOn={autoLock} onToggle={() => setAutoLock(!autoLock)} last />
        </SettingSection>

        <SettingSection title="Notifications">
          <SettingRow label="Push Notifications" description="Receive app notifications" showToggle toggleOn={pushNotifications} onToggle={() => setPushNotifications(!pushNotifications)} first />
          <SettingRow label="Appointment Reminders" description="Get notified about upcoming appointments" showToggle toggleOn={appointmentReminders} onToggle={() => setAppointmentReminders(!appointmentReminders)} last />
        </SettingSection>

        <SettingSection title="Data & Sync">
          <SettingRow label="Auto-sync" description="Automatically sync when connected" showToggle toggleOn={autoSync} onToggle={() => setAutoSync(!autoSync)} first />
          <SettingRow label="Offline Mode" description="Allow offline data access" showToggle toggleOn={offlineMode} onToggle={() => setOfflineMode(!offlineMode)} last />
        </SettingSection>

        <SettingSection title="System">
          <SettingRow label="Help & Support" description="Get help and contact support" onClick={handleHelpSupport} first />
          <SettingRow label="Privacy Policy" description="View our privacy policy" onClick={handlePrivacyPolicy} last />
        </SettingSection>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: theme.colors.oscarGray,
    fontFamily: theme.font.family,
    overflow: "hidden",
  },
  header: {
    backgroundColor: theme.colors.oscarWhite,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${theme.colors.oscarGray}`,
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
    color: theme.colors.oscarBlack,
    margin: "0",
    flex: 1,
    textAlign: "center",
  },
  spacer: {
    width: "24px",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
  },
  section: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: theme.colors.oscarBlack,
    margin: "0",
  },
  sectionTitleContainer: {
    backgroundColor: theme.colors.oscarWhite,
    padding: "16px 20px 12px 20px",
  },
  sectionContainer: {
    backgroundColor: theme.colors.oscarWhite,
    borderRadius: "12px",
    overflow: "hidden",
  },
  settingItemFirst: {
    backgroundColor: theme.colors.oscarWhite,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${theme.colors.oscarWhite}`,
  },
  settingItemLast: {
    backgroundColor: theme.colors.oscarWhite,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemFirst: {
    backgroundColor: theme.colors.oscarWhite,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${theme.colors.oscarWhite}`,
    cursor: "pointer",
  },
  menuItemLast: {
    backgroundColor: theme.colors.oscarWhite,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  settingItem: {
    backgroundColor: theme.colors.oscarWhite,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${theme.colors.oscarWhite}`,
    borderRadius: "8px 8px 0 0",
  },
  settingInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  settingLabel: {
    fontSize: "16px",
    color: theme.colors.oscarBlack,
    fontWeight: "400",
    marginBottom: "2px",
  },
  settingDescription: {
    fontSize: "14px",
    color: theme.colors.paleSky,
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
    backgroundColor: theme.colors.oscarWhite,
    borderRadius: "11px",
    position: "absolute",
    top: "2px",
    transition: "transform 0.2s",
    boxShadow: theme.shadows.sm,
  },
  menuItem: {
    backgroundColor: theme.colors.oscarWhite,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${theme.colors.oscarWhite}`,
    cursor: "pointer",
    borderRadius: "8px 8px 0 0",
  },
  menuItemNoBorder: {
    backgroundColor: theme.colors.oscarWhite,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    borderRadius: "0 0 8px 8px",
  },
};

export default SettingsScreen;
