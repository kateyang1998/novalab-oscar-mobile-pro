import React from 'react';
import Modal from '../common/Modal';
import theme from '../../styles/theme';
import { IconRefresh } from '../common/Icons';

const SyncStatusModal = ({ onClose, onSync }) => {
  return (
    <Modal onDismiss={onClose}>
      <div style={styles.content}>
        <h3 style={styles.title}>Sync Status</h3>
        <div style={styles.syncStatusContainer}>
          <div style={styles.syncItem}><span style={styles.syncLabel}>Last Sync:</span><span style={styles.syncValue}>Mar 4, 2026 2:30 PM</span></div>
          <div style={styles.syncItem}><span style={styles.syncLabel}>Status:</span><span style={{...styles.syncValue, color: theme.colors.oscarGreen}}>✓ Up to date</span></div>
          <div style={styles.syncItem}><span style={styles.syncLabel}>Patient Records:</span><span style={styles.syncValue}>1,247 synced</span></div>
          <div style={styles.syncItem}><span style={styles.syncLabel}>Clinical Notes:</span><span style={styles.syncValue}>863 synced</span></div>
          <div style={styles.syncItem}><span style={styles.syncLabel}>Appointments:</span><span style={styles.syncValue}>425 synced</span></div>
          <div style={styles.syncItem}><span style={styles.syncLabel}>Network:</span><span style={styles.syncValue}>Connected</span></div>
        </div>
        <div style={styles.buttons}>
          <button style={styles.syncNow} onClick={onSync}><IconRefresh size={16} color={theme.colors.oscarWhite} /> Sync Now</button>
          <button style={styles.close} onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

const styles = {
  content: { textAlign: 'center' },
  title: { fontSize: 16, fontWeight: 600, color: theme.colors.oscarBlack, margin: '0 0 12px 0' },
  syncStatusContainer: { textAlign: 'left', marginBottom: 20 },
  syncItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.colors.oscarWhite}` },
  syncLabel: { fontSize: 14, color: theme.colors.paleSky, fontWeight: 500 },
  syncValue: { fontSize: 14, color: theme.colors.shark, fontWeight: 400 },
  buttons: { display: 'flex', gap: 12 },
  close: { flex: 1, padding: '12px', backgroundColor: theme.colors.oscarWhite, color: theme.colors.paleSky, border: `1px solid ${theme.colors.oscarGray}`, borderRadius: 8 },
  syncNow: { flex: 1, padding: '12px', backgroundColor: theme.colors.oscarBlue, color: theme.colors.oscarWhite, border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' },
};

export default SyncStatusModal;

