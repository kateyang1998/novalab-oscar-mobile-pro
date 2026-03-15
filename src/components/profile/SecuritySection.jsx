import React from 'react';
import theme from '../../styles/theme';
import { IconChevronRight } from '../common/Icons';

const SecuritySection = ({ onChangePassword, biometricEnabled, onToggleBiometric }) => {
  return (
    <div style={styles.section}>
      <h3 style={styles.title}>Security</h3>

      <div style={styles.menuItem} onClick={onChangePassword}>
        <span style={styles.menuItemText}>Change Password</span>
        <IconChevronRight size={20} color={theme.colors.paleSky} />
      </div>

      <div style={styles.menuItem} onClick={onToggleBiometric}>
        <span style={styles.menuItemText}>Biometric Login</span>
        <div style={{ ...styles.toggleSwitch, backgroundColor: biometricEnabled ? theme.colors.oscarBlue : theme.colors.oscarGray }}>
          <div style={{ ...styles.toggleKnob, transform: biometricEnabled ? 'translateX(20px)' : 'translateX(2px)' }} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  section: { backgroundColor: theme.colors.oscarWhite, borderRadius: 12, padding: 0, marginBottom: 24, overflow: 'hidden' },
  title: { fontSize: 18, fontWeight: 600, color: theme.colors.oscarBlack, margin: 0, padding: '20px 20px 16px 20px' },
  menuItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${theme.colors.oscarGray}`, cursor: 'pointer' },
  menuItemText: { fontSize: 16, color: theme.colors.oscarBlack, fontWeight: 400 },
  toggleSwitch: { width: 44, height: 26, borderRadius: 13, position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' },
  toggleKnob: { width: 22, height: 22, backgroundColor: theme.colors.oscarWhite, borderRadius: 11, position: 'absolute', top: 2, transition: 'transform 0.2s', boxShadow: theme.shadows.sm },
};

export default SecuritySection;

