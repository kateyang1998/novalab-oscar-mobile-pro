import React from 'react';
import theme from '../../styles/theme';

const SettingSection = ({ title, children }) => {
  return (
    <div style={styles.section}>
      <div style={styles.sectionTitleContainer}>
        <h3 style={styles.sectionTitle}>{title}</h3>
      </div>
      <div style={styles.divider} />
      <div style={styles.sectionContainer}>{children}</div>
    </div>
  );
};

const styles = {
  section: { marginBottom: 24 },
  // Title area: top rounded corners so it visually connects with the content below
  sectionTitleContainer: {
    backgroundColor: theme.colors.oscarWhite,
    padding: '12px 20px',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: 600, color: theme.colors.oscarBlack, margin: 0 },
  // Content area: only bottom corners rounded so the two parts appear as one card
  sectionContainer: {
    backgroundColor: theme.colors.oscarWhite,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  // Divider placed between title and content to visually separate sections
  divider: {
    height: 1,
    backgroundColor: theme.colors.oscarGray,
    width: '100%'
  },
};

export default SettingSection;

