import { useNavigate } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import { useState } from "react";
import theme from '../styles/theme';
import UserProfileCard from '../components/profile/UserProfileCard';
import SecuritySection from '../components/profile/SecuritySection';
import SystemSection from '../components/profile/SystemSection';
import LogoutButton from '../components/profile/LogoutButton';
import LogoutConfirmModal from '../components/profile/LogoutConfirmModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import SyncStatusModal from '../components/profile/SyncStatusModal';

/**
 * Profile Screen Component
 * User profile management interface displaying:
 * - Doctor profile information (name, specialty, email, ID)
 * - Security settings (change password, biometric login toggle, reset password)
 * - System settings (general settings, sync status, app version)
 * - Logout functionality with confirmation modal
 * - Navigation back to previous screen
 */
const ProfileScreen = () => {
  const navigate = useNavigate();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showSyncStatusModal, setShowSyncStatusModal] = useState(false);

  // (Change password modal manages its own form state)


  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    console.log("Logout confirmed");
    setShowLogoutConfirmation(false);
    // For now, just navigate to sign in or home
    navigate("/signin");
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleChangePasswordClick = () => {
    setShowChangePasswordModal(true);
  };

  const handleChangePasswordSubmit = ({ current, next, confirm }) => {
    if (next !== confirm) {
      alert("New passwords don't match!");
      return;
    }
    if (next.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    // TODO: call change password API
    console.log('Change password', { current, next });
    setShowChangePasswordModal(false);
    alert('Password changed successfully!');
  };

  const handleSyncStatusClick = () => {
    setShowSyncStatusModal(true);
  };

  const closeSyncStatusModal = () => {
    setShowSyncStatusModal(false);
  };

  const handleSyncNow = () => {
    // TODO: Implement sync functionality
    console.log("Sync now clicked");
    alert("Sync completed successfully!");
    setShowSyncStatusModal(false);
  };


  return (
    <div style={styles.container}>
      {/* Header */}
      <TopHeader title="Profile" onBack={handleBackClick} />

      <div style={styles.content}>
        <UserProfileCard />

        <SecuritySection
          onChangePassword={handleChangePasswordClick}
          biometricEnabled={biometricEnabled}
          onToggleBiometric={() => setBiometricEnabled(!biometricEnabled)}
        />

        <SystemSection
          onSettings={handleSettingsClick}
          onSyncStatus={handleSyncStatusClick}
        />

        <LogoutButton onLogout={handleLogout} />
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <LogoutConfirmModal onConfirm={confirmLogout} onDismiss={cancelLogout} />
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <ChangePasswordModal onSubmit={handleChangePasswordSubmit} onDismiss={() => setShowChangePasswordModal(false)} />
      )}

      {/* Sync Status Modal */}
      {showSyncStatusModal && (
        <SyncStatusModal onClose={closeSyncStatusModal} onSync={() => { handleSyncNow(); }} />
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: theme.colors.oscarGray,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: theme.font.family,
  },
  content: {
    flex: 1,
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
};

export default ProfileScreen;
