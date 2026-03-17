import React from 'react';
import Modal from './Modal';
import theme from '../../styles/theme';

const UnsavedChangesModal = ({
  open,
  onDismiss,
  onDiscard,
  title = 'Discard changes?',
  message = 'You have unsaved changes. Are you sure you want to discard them?',
  keepLabel = 'Keep editing',
  discardLabel = 'Discard',
}) => {
  if (!open) return null;

  return (
    <Modal onDismiss={onDismiss}>
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>
      </div>

      <div style={styles.buttons}>
        <button style={styles.cancel} onClick={onDismiss}>{keepLabel}</button>
        <button style={styles.confirm} onClick={onDiscard}>{discardLabel}</button>
      </div>
    </Modal>
  );
};

export default UnsavedChangesModal;

const styles = {
  content: { textAlign: 'center' },
  title: { fontSize: 16, fontWeight: 600, color: theme.colors.oscarBlack, margin: '0 0 16px 0' },
  message: { fontSize: 14, color: theme.colors.paleSky, margin: '0 0 20px 0' },
  buttons: { display: 'flex', gap: 12 },
  cancel: { flex: 1, padding: '14px 16px', backgroundColor: theme.colors.oscarBlue, color: theme.colors.oscarWhite, border: 'none', borderRadius: 8, cursor: 'pointer' },
  confirm: { flex: 1, padding: '14px 16px', backgroundColor: theme.colors.oscarRed, color: theme.colors.oscarWhite, border: `1px solid ${theme.colors.oscarGray}`, borderRadius: 8, cursor: 'pointer' },
};

