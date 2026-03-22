import React, { useState } from 'react';
import Modal from '../common/Modal';
import theme from '../../styles/theme';

const ChangePasswordModal = ({ onSubmit, onDismiss, serverError = '', clearServerError }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({ current: '', next: '', confirm: '' });

  function handleSubmit() {
    // Client-side validations
    const newErrors = { current: '', next: '', confirm: '' };
    if (!current.trim()) newErrors.current = 'Please enter your current password.';
    if (!next.trim()) newErrors.next = 'Please enter a new password.';
    else if (next.length < 8) newErrors.next = 'New password must be at least 8 characters.';
    if (!confirm.trim()) newErrors.confirm = 'Please confirm your new password.';
    else if (confirm !== next) newErrors.confirm = 'Passwords do not match.';

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    onSubmit({ current, next, confirm });
  }

  return (
    <Modal onDismiss={onDismiss}>
      <div style={styles.content}>
        <h3 style={styles.title}>Change Password</h3>
        <div style={styles.form}>
          <label style={styles.label} htmlFor="change-current">Current Password</label>
          <input
            id="change-current"
            className={`form-input ${(errors.current || serverError) ? 'form-input--error' : ''}`}
            style={styles.input}
            type="password"
            value={current}
            onChange={(e) => {
              setCurrent(e.target.value);
              if (errors.current) setErrors(es => ({ ...es, current: '' }));
              if (serverError && typeof clearServerError === 'function') clearServerError();
            }}
            placeholder="Enter current password"
            aria-invalid={!!errors.current || !!serverError}
            aria-describedby={(errors.current || serverError) ? 'change-current-error' : undefined}
          />
          {(errors.current || serverError) && (
            <div id="change-current-error" role="alert" style={{ color: 'var(--oscar-red)', marginTop: -6, marginBottom: 6, fontSize: 14 }}>{errors.current || serverError}</div>
          )}

          <label style={styles.label} htmlFor="change-next">New Password</label>
          <input
            id="change-next"
            className={`form-input ${errors.next ? 'form-input--error' : ''}`}
            style={styles.input}
            type="password"
            value={next}
            onChange={(e) => { setNext(e.target.value); if (errors.next) setErrors(es => ({ ...es, next: '' })); }}
            placeholder="Enter new password"
            aria-invalid={!!errors.next}
            aria-describedby={errors.next ? 'change-next-error' : undefined}
          />
          {errors.next && (
            <div id="change-next-error" role="alert" style={{ color: 'var(--oscar-red)', marginTop: -6, marginBottom: 6, fontSize: 14 }}>{errors.next}</div>
          )}

          <label style={styles.label} htmlFor="change-confirm">Confirm New Password</label>
          <input
            id="change-confirm"
            className={`form-input ${errors.confirm ? 'form-input--error' : ''}`}
            style={styles.input}
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); if (errors.confirm) setErrors(es => ({ ...es, confirm: '' })); }}
            placeholder="Confirm new password"
            aria-invalid={!!errors.confirm}
            aria-describedby={errors.confirm ? 'change-confirm-error' : undefined}
          />
          {errors.confirm && (
            <div id="change-confirm-error" role="alert" style={{ color: 'var(--oscar-red)', marginTop: -6, marginBottom: 6, fontSize: 14 }}>{errors.confirm}</div>
          )}
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
  label: { display: 'block', fontSize: 12, fontWeight: 500, color: theme.colors.shark, marginBottom: 6 },
  input: { width: '100%', padding: '12px 16px', borderRadius: 8, marginBottom: 8, backgroundColor: theme.colors.oscarWhite, fontSize: 14, color: theme.colors.shark },
  buttons: { display: 'flex', gap: 12 },
  cancel: { flex: 1, padding: '12px', backgroundColor: theme.colors.oscarWhite, color: theme.colors.paleSky, border: `1px solid ${theme.colors.oscarGray}`, borderRadius: 8 },
  confirm: { flex: 1, padding: '12px', backgroundColor: theme.colors.oscarRed, color: theme.colors.oscarWhite, border: 'none', borderRadius: 8 },
};

export default ChangePasswordModal;

