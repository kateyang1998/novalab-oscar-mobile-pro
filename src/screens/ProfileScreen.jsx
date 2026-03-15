import { useNavigate } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import { useState } from "react";
import BottomTab from "../components/BottomTab";
import theme from '../styles/theme';
import UserProfileCard from '../components/profile/UserProfileCard';
import SecuritySection from '../components/profile/SecuritySection';
import SystemSection from '../components/profile/SystemSection';
import LogoutButton from '../components/profile/LogoutButton';
import LogoutConfirmModal from '../components/profile/LogoutConfirmModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import SyncStatusModal from '../components/profile/SyncStatusModal';
import { IconChevronRight } from '../components/common/Icons';

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

      {/* Bottom Navigation */}
      <BottomTab />

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
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
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
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  profileCard: {
    backgroundColor: theme.colors.oscarWhite,
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  profileIcon: {
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: "20px",
    fontWeight: "700",
    color: theme.colors.oscarBlack,
    margin: "0 0 4px 0",
  },
  specialty: {
    fontSize: "14px",
    color: theme.colors.paleSky,
    margin: "0 0 4px 0",
  },
  email: {
    fontSize: "14px",
    color: theme.colors.paleSky,
    margin: "0 0 4px 0",
  },
  doctorId: {
    fontSize: "14px",
    color: theme.colors.paleSky,
    margin: "0",
  },
  section: {
    backgroundColor: theme.colors.oscarWhite,
    borderRadius: "12px",
    padding: "0",
    marginBottom: "24px",
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: theme.colors.oscarBlack,
    margin: "0",
    padding: "20px 20px 16px 20px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: `1px solid ${theme.colors.oscarGray}`,
    cursor: "pointer",
  },
  menuItemNoBorder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    cursor: "pointer",
  },
  menuItemText: {
    fontSize: "16px",
    color: theme.colors.oscarBlack,
    fontWeight: "400",
  },
  versionText: {
    fontSize: "16px",
    color: theme.colors.paleSky,
    fontWeight: "400",
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
  logoutButton: {
    width: "100%",
    padding: "16px",
    backgroundColor: theme.colors.oscarRed,
    color: theme.colors.oscarWhite,
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
  },
  modalOverlay: {},
  modalContainer: {},
  modalContent: {
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: theme.colors.oscarBlack,
    margin: "0 0 16px 0",
    lineHeight: "1.4",
  },
  modalMessage: {
    fontSize: "14px",
    color: theme.colors.paleSky,
    margin: "0 0 24px 0",
    lineHeight: "1.5",
  },
  modalButtons: {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    width: "100%",
  },
  cancelButton: {
    padding: "14px 16px",
    backgroundColor: theme.colors.oscarWhite,
    color: theme.colors.paleSky,
    border: `1px solid ${theme.colors.oscarGray}`,
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    flex: 1,
  },
  confirmButton: {
    padding: "14px 16px",
    backgroundColor: theme.colors.oscarRed,
    color: theme.colors.oscarWhite,
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    flex: 1,
  },
  formContainer: {
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  inputLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: theme.colors.shark,
    marginBottom: "6px",
  },
  inputField: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    border: `1px solid ${theme.colors.oscarGray}`,
    borderRadius: "8px",
    backgroundColor: theme.colors.oscarWhite,
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
  },
  syncStatusContainer: {
    textAlign: "left",
    marginBottom: "20px",
  },
  syncItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: `1px solid ${theme.colors.oscarWhite}`,
  },
  syncLabel: {
    fontSize: "14px",
    color: theme.colors.paleSky,
    fontWeight: "500",
  },
  syncValue: {
    fontSize: "14px",
    color: theme.colors.shark,
    fontWeight: "400",
  },
  syncButtonContainer: {
    display: "flex",
    gap: "12px",
    width: "100%",
  },
  syncNowButton: {
    padding: "14px 16px",
    backgroundColor: theme.colors.oscarBlue,
    color: theme.colors.oscarWhite,
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    flex: 1,
  },
};

export default ProfileScreen;
