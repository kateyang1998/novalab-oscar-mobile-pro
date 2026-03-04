import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomTab from "../components/BottomTab";

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
        <h1 style={styles.headerTitle}>Profile</h1>
        <div style={styles.spacer}></div>
      </div>

      <div style={styles.content}>
        {/* User Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.profileIcon}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="20" fill="#B0B0B0" />
              <path
                d="M20 20c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="white"
              />
            </svg>
          </div>
          <div style={styles.profileInfo}>
            <h2 style={styles.doctorName}>Dr. Full Name</h2>
            <p style={styles.specialty}>Family Physician</p>
            <p style={styles.email}>adkfij@oscar.ca</p>
            <p style={styles.doctorId}>ID: CL001234</p>
          </div>
        </div>

        {/* Security Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Security</h3>

          <div style={styles.menuItem}>
            <span style={styles.menuItemText}>Change Password</span>
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

          <div style={styles.menuItem}>
            <span style={styles.menuItemText}>Biometric Login</span>
            <div
              style={{
                ...styles.toggleSwitch,
                backgroundColor: biometricEnabled ? "#007AFF" : "#E5E5E7"
              }}
              onClick={() => setBiometricEnabled(!biometricEnabled)}
            >
              <div
                style={{
                  ...styles.toggleKnob,
                  transform: biometricEnabled ? "translateX(20px)" : "translateX(2px)"
                }}
              ></div>
            </div>
          </div>

          <div style={styles.menuItem}>
            <span style={styles.menuItemText}>Reset Password</span>
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

        {/* System Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>System</h3>

          <div style={styles.menuItem}>
            <span style={styles.menuItemText}>Settings</span>
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

          <div style={styles.menuItem}>
            <span style={styles.menuItemText}>Sync Status</span>
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

          <div style={styles.menuItemNoBorder}>
            <span style={styles.menuItemText}>App Version</span>
            <span style={styles.versionText}>v2.1.0</span>
          </div>
        </div>

        {/* Logout Button */}
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomTab />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <div style={styles.modalContent}>
              <h3 style={styles.modalTitle}>Are you sure you want to logout?</h3>
              <p style={styles.modalMessage}>
                You will need to sign in again to access the app.
              </p>
              <div style={styles.modalButtons}>
                <button style={styles.confirmButton} onClick={confirmLogout}>
                  Yes
                </button>
                <button style={styles.cancelButton} onClick={cancelLogout}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
  profileCard: {
    backgroundColor: "#FFFFFF",
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
    color: "#000000",
    margin: "0 0 4px 0",
  },
  specialty: {
    fontSize: "14px",
    color: "#8E8E93",
    margin: "0 0 4px 0",
  },
  email: {
    fontSize: "14px",
    color: "#8E8E93",
    margin: "0 0 4px 0",
  },
  doctorId: {
    fontSize: "14px",
    color: "#8E8E93",
    margin: "0",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "0",
    marginBottom: "24px",
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#000000",
    margin: "0",
    padding: "20px 20px 16px 20px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #E5E5E7",
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
    color: "#000000",
    fontWeight: "400",
  },
  versionText: {
    fontSize: "16px",
    color: "#8E8E93",
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
    backgroundColor: "#FFFFFF",
    borderRadius: "11px",
    position: "absolute",
    top: "2px",
    transition: "transform 0.2s",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  logoutButton: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#DC3545",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "24px",
    width: "100%",
    maxWidth: "320px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  },
  modalContent: {
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#000000",
    margin: "0 0 16px 0",
    lineHeight: "1.4",
  },
  modalMessage: {
    fontSize: "14px",
    color: "#666666",
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
    backgroundColor: "#F8F9FA",
    color: "#666666",
    border: "1px solid #E5E5E7",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    flex: 1,
  },
  confirmButton: {
    padding: "14px 16px",
    backgroundColor: "#DC3545",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    flex: 1,
  },
};

export default ProfileScreen;
