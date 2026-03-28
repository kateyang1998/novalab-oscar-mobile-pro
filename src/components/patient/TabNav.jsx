import React from 'react';
import theme from '../../styles/theme';

const TabNav = ({ activeTab, onChange }) => {
  const tabs = [
    { key: 'summary', label: 'Summary' },
    { key: 'notes', label: 'Notes' },
    { key: 'history', label: 'History' },
    { key: 'vitals', label: 'Vitals' },
  ];

  return (
    <div style={styles.tabContainer}>
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{ ...styles.tab, ...(activeTab === t.key ? styles.activeTab : {}) }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

const styles = {
  tabContainer: { display: 'flex', gap: 8, marginBottom: 20 },
  tab: {
    flex: 1,
    padding: '12px 16px',
    fontSize: 14,
    fontWeight: 500,
    color: theme.colors.oscarBlack,
    backgroundColor: theme.colors.oscarWhite,
    border: 'none',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeTab: {
    backgroundColor: theme.colors.oscarBlue,
    color: theme.colors.oscarWhite,
    fontWeight: 600,
  },
};

export default TabNav;

