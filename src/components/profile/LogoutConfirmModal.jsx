import React from 'react';
import Modal from '../common/Modal';
import theme from '../../styles/theme';

const LogoutConfirmModal = ({ onConfirm, onDismiss }) => {
  return (
    <Modal onDismiss={onDismiss}>
      <div style={styles.content}>
        <h3 style={styles.title}>Are you sure you want to logout?</h3>
        <p style={styles.message}>You will need to sign in again to access the app.</p>
        <div style={styles.buttons}>
          <button style={styles.confirm} onClick={onConfirm}>Yes</button>
          <button style={styles.cancel} onClick={onDismiss}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

const styles = {
  content: { textAlign: 'center' },
  title: { fontSize: 16, fontWeight: 600, color: theme.colors.oscarBlack, margin: '0 0 16px 0' },
  message: { fontSize: 14, color: theme.colors.paleSky, margin: '0 0 20px 0' },
  buttons: { display: 'flex', gap: 12 },
  cancel: { flex: 1, padding: '14px 16px', backgroundColor: theme.colors.oscarWhite, color: theme.colors.paleSky, border: `1px solid ${theme.colors.oscarGray}`, borderRadius: 8 },
  confirm: { flex: 1, padding: '14px 16px', backgroundColor: theme.colors.oscarRed, color: theme.colors.oscarWhite, border: 'none', borderRadius: 8 },
};

export default LogoutConfirmModal;

