import React from 'react';
import theme from '../../styles/theme';
import { IconChevronRight } from '../common/Icons';

const SystemSection = ({ onSettings, onSyncStatus }) => {
  return (
    <div style={styles.section}>
      <h3 style={styles.title}>System</h3>

      <div style={styles.menuItem} onClick={onSettings}>
        <span style={styles.menuItemText}>Settings</span>
        <IconChevronRight size={20} color={theme.colors.paleSky} />
      </div>

      <div style={styles.menuItem} onClick={onSyncStatus}>
        <span style={styles.menuItemText}>Sync Status</span>
        <IconChevronRight size={20} color={theme.colors.paleSky} />
      </div>

      <div style={styles.menuItemNoBorder}>
        <span style={styles.menuItemText}>App Version</span>
        <span style={styles.versionText}>v2.1.0</span>
      </div>
    </div>
  );
};

const styles = {
  section: { backgroundColor: theme.colors.oscarWhite, borderRadius: 12, padding: 0, marginBottom: 24, overflow: 'hidden' },
  title: { fontSize: 18, fontWeight: 600, color: theme.colors.oscarBlack, margin: 0, padding: '20px 20px 16px 20px' },
  menuItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${theme.colors.oscarGray}`, cursor: 'pointer' },
  menuItemNoBorder: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer' },
  menuItemText: { fontSize: 16, color: theme.colors.oscarBlack, fontWeight: 400 },
  versionText: { fontSize: 16, color: theme.colors.paleSky, fontWeight: 400 },
};

export default SystemSection;

