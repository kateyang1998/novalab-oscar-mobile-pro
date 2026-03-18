import { useNavigate } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import { useState, useEffect } from "react";
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

  const [settings, setSettings] = useState({
    biometricLogin:       true,
    autoLock:             true,
    pushNotifications:    true,
    appointmentReminders: true,
    autoSync:             true,
    offlineMode:          true,
  });

  // Load persisted settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const handleToggle = (key) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    // Persist the change
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: newValue }),
    }).catch(() => {});
  };

  const handleBackClick = () => navigate(-1);

  return (
    <div style={styles.container}>
      <TopHeader title="Settings" onBack={handleBackClick} />

      <div style={styles.content}>
        <SettingSection title="Security">
          <SettingRow label="Biometric Login" description="Use Face ID or fingerprint to sign in" showToggle toggleOn={settings.biometricLogin} onToggle={() => handleToggle('biometricLogin')} first />
          <SettingRow label="Auto-Lock" description="Lock app after inactivity" showToggle toggleOn={settings.autoLock} onToggle={() => handleToggle('autoLock')} last />
        </SettingSection>

        <SettingSection title="Notifications">
          <SettingRow label="Push Notifications" description="Receive app notifications" showToggle toggleOn={settings.pushNotifications} onToggle={() => handleToggle('pushNotifications')} first />
          <SettingRow label="Appointment Reminders" description="Get notified about upcoming appointments" showToggle toggleOn={settings.appointmentReminders} onToggle={() => handleToggle('appointmentReminders')} last />
        </SettingSection>

        <SettingSection title="Data & Sync">
          <SettingRow label="Auto-sync" description="Automatically sync when connected" showToggle toggleOn={settings.autoSync} onToggle={() => handleToggle('autoSync')} first />
          <SettingRow label="Offline Mode" description="Allow offline data access" showToggle toggleOn={settings.offlineMode} onToggle={() => handleToggle('offlineMode')} last />
        </SettingSection>

        <SettingSection title="System">
          <SettingRow label="Help & Support" description="Get help and contact support" onClick={() => navigate('/help')} first />
          <SettingRow label="Privacy Policy" description="View our privacy policy" onClick={() => navigate('/privacy')} last />
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
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
  },
};

export default SettingsScreen;
