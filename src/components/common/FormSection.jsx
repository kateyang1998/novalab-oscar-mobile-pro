import React from 'react';

const FormSection = ({ title, children, style }) => {
  return (
    <div style={{ ...styles.section, ...style }}>
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    paddingBottom: 8,
    borderBottom: '2px solid var(--color-primary)',
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: 700, color: 'var(--color-primary)', margin: 0 },
};

export default FormSection;

