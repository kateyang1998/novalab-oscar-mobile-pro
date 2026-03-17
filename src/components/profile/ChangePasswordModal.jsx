import React, { useState } from 'react';
import Modal from '../common/Modal';
import theme from '../../styles/theme';

const ChangePasswordModal = ({ onSubmit, onDismiss }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  function handleSubmit() {
    onSubmit({ current, next, confirm });
  }

  return (
    <Modal onDismiss={onDismiss}>
      <div style={styles.content}>
        <h3 style={styles.title}>Change Password</h3>
        <div style={styles.form}>
          <label style={styles.label}>Current Password</label>
          <input className="form-input" style={styles.input} type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Enter current password" />

          <label style={styles.label}>New Password</label>
          <input className="form-input" style={styles.input} type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="Enter new password" />

          <label style={styles.label}>Confirm New Password</label>
          <input className="form-input" style={styles.input} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" />
        </div>
        <div style={styles.buttons}>
          <button style={styles.confirm} onClick={handleSubmit}>Change</button>
          <button style={styles.cancel} onClick={onDismiss}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

const styles = {
  content: { textAlign: 'center' },
  title: { fontSize: 16, fontWeight: 600, color: theme.colors.oscarBlack, margin: '0 0 12px 0' },
  form: { marginBottom: 16, textAlign: 'left' },
  label: { display: 'block', fontSize: 14, color: theme.colors.shark, marginBottom: 6 },
  input: { width: '100%', padding: '12px 16px', border: `1px solid ${theme.colors.oscarGray}`, borderRadius: 8, marginBottom: 12, backgroundColor: theme.colors.oscarWhite, color: theme.colors.shark },
  buttons: { display: 'flex', gap: 12 },
  cancel: { flex: 1, padding: '12px', backgroundColor: theme.colors.oscarWhite, color: theme.colors.paleSky, border: `1px solid ${theme.colors.oscarGray}`, borderRadius: 8 },
  confirm: { flex: 1, padding: '12px', backgroundColor: theme.colors.oscarRed, color: theme.colors.oscarWhite, border: 'none', borderRadius: 8 },
};

export default ChangePasswordModal;

