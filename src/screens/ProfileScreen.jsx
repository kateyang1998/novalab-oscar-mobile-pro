import { useNavigate } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import { useState, useEffect } from "react";
import theme from '../styles/theme';
import UserProfileCard from '../components/profile/UserProfileCard';
import SecuritySection from '../components/profile/SecuritySection';
import SystemSection from '../components/profile/SystemSection';
import LogoutButton from '../components/profile/LogoutButton';
import LogoutConfirmModal from '../components/profile/LogoutConfirmModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import { useToast } from '../components/common/toastContext';
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
  const [clinician, setClinician] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  useEffect(() => {
    fetch('/api/clinician')
      .then(r => r.json())
      .then(data => setClinician(data))
      .catch(() => { });
  }, []);

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showSyncStatusModal, setShowSyncStatusModal] = useState(false);
  const [serverPasswordError, setServerPasswordError] = useState('');
  const toast = useToast();

  const handleBackClick = () => navigate(-1);

  const handleLogout = () => setShowLogoutConfirmation(true);

  const confirmLogout = () => {
    setShowLogoutConfirmation(false);
    navigate("/signin");
  };

  const cancelLogout = () => setShowLogoutConfirmation(false);

  const handleSettingsClick = () => navigate("/settings");

  const handleChangePasswordClick = () => setShowChangePasswordModal(true);

  const handleChangePasswordSubmit = async ({ current, next, confirm }) => {
    if (next !== confirm) {
      toast.showToast({ message: "New passwords don't match!", variant: 'warning' });
      return;
    }
    if (next.length < 8) {
      toast.showToast({ message: "Password must be at least 8 characters long!", variant: 'warning' });
      return;
    }

    try {
      const res = await fetch('/api/clinician/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If server indicates current password incorrect, show it inside the modal
        if (data && data.error && data.error.toLowerCase().includes('current')) {
          // show server error in modal under current password
          setServerPasswordError(data.error || 'Current password is incorrect');
          // keep modal open
          setShowChangePasswordModal(true);
          // also show a toast
          toast.showToast({ message: data.error || 'Current password is incorrect', variant: 'error' });
          return;
        }
        toast.showToast({ message: data.error || 'Failed to change password', variant: 'error' });
        return;
      }
      setShowChangePasswordModal(false);
      setServerPasswordError('');
      toast.showToast({ message: 'Password changed successfully!', variant: 'success' });
    } catch {
      toast.showToast({ message: 'Network error — could not change password', variant: 'error' });
    }
  };

  const handleSyncStatusClick = () => setShowSyncStatusModal(true);

  const closeSyncStatusModal = () => setShowSyncStatusModal(false);

  const handleSyncNow = async () => {
    try {
      const res = await fetch('/api/clinician/sync', { method: 'POST' });
      const data = await res.json();
      if (data && data.syncedAt) {
        const d = new Date(data.syncedAt);
        setLastSyncedAt(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        toast.showToast({ message: 'Sync completed successfully!', variant: 'success' });
      } else {
        // If server didn't return syncedAt, still treat as success but show a generic message
        toast.showToast({ message: 'Sync completed.', variant: 'success' });
      }
    } catch {
      toast.showToast({ message: 'Sync failed — network error', variant: 'error' });
    }
    setShowSyncStatusModal(false);
  };

  return (
    <div style={styles.container}>
      <TopHeader title="Profile" onBack={handleBackClick} />

      <div style={styles.content}>
        <UserProfileCard
          name={clinician?.name}
          specialty={clinician?.role}
          email={clinician?.email}
          id={clinician ? `CL00${String(clinician.clinicianId).padStart(4, '0')}` : undefined}
        />

        <SecuritySection
          onChangePassword={handleChangePasswordClick}
          biometricEnabled={biometricEnabled}
          onToggleBiometric={() => setBiometricEnabled(!biometricEnabled)}
        />

        <SystemSection
          onSettings={handleSettingsClick}
          onSyncStatus={handleSyncStatusClick}
          lastSyncedAt={lastSyncedAt}
        />

        <LogoutButton onLogout={handleLogout} />
      </div>

      {showLogoutConfirmation && (
        <LogoutConfirmModal onConfirm={confirmLogout} onDismiss={cancelLogout} />
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          onSubmit={handleChangePasswordSubmit}
          onDismiss={() => { setShowChangePasswordModal(false); setServerPasswordError(''); }}
          serverError={serverPasswordError}
          clearServerError={() => setServerPasswordError('')}
        />
      )}

      {showSyncStatusModal && (
        <SyncStatusModal onClose={closeSyncStatusModal} onSync={handleSyncNow} lastSyncedAt={lastSyncedAt} />
      )}
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

export default ProfileScreen;
