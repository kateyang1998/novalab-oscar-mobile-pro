import React from 'react';

const SummaryTab = ({ patient }) => {
  return (
    <div>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Medical Conditions</h3>
        <div style={styles.singleColumnList}>
          {patient.medicalConditions ? (
            patient.medicalConditions.map((c, i) => (
              <div key={i} style={styles.pillItem}>
                <div style={styles.pillLeft}>{c.condition}</div>
                <div style={styles.pillRight}>Diagnosed: {c.diagnosed}</div>
              </div>
            ))
          ) : (
            <p style={styles.itemSubtext}>No known conditions</p>
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Current Medications</h3>
        <div style={styles.singleColumnList}>
          {patient.medications ? (
            patient.medications.map((m, i) => (
              <div key={i} style={styles.pillItem}>
                <div style={styles.pillLeft}>{m.name} {m.dosage}</div>
                <div style={styles.pillRight}>{m.frequency}</div>
              </div>
            ))
          ) : (
            <p style={styles.itemSubtext}>No medications listed</p>
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recent Vitals</h3>
        <div style={styles.vitalsGrid}>
          {patient.vitals ? (
            Object.values(patient.vitals).map((v, i) => (
              <div key={i} style={styles.vitalCard}>
                <p style={styles.vitalLabel}>{v.label}</p>
                <p style={styles.vitalValue}>{v.value}</p>
              </div>
            ))
          ) : (
            <p style={styles.itemSubtext}>No vitals recorded</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  section: { backgroundColor: 'var(--color-surface)', borderRadius: 12, padding: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 700, margin: '0 0 16px 0', color: 'var(--color-text)' },
  singleColumnList: { display: 'flex', flexDirection: 'column', gap: 12 },
  pillItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--color-neutral-1)',
    borderRadius: 12,
    padding: '12px 16px',
  },
  pillLeft: { fontSize: 14, fontWeight: 500, color: 'var(--color-text)' },
  pillRight: { fontSize: 14, color: 'var(--color-neutral-7)' },
  itemSubtext: { fontSize: 13, color: 'var(--color-neutral-7)', margin: 0 },
  vitalsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 },
  vitalCard: { backgroundColor: 'var(--color-neutral-1)', borderRadius: 12, padding: 20, textAlign: 'center' },
  vitalLabel: { fontSize: 14, color: 'var(--color-neutral-7)', margin: '0 0 8px 0' },
  vitalValue: { fontSize: 14, fontWeight: 600, margin: 0, color: 'var(--color-text)' },
};

export default SummaryTab;

