import React from 'react';

const VitalsTab = ({ patientId }) => {
  const mockVitalRecords = [
    { id: '1', date: 'Feb 9, 2026', bp: '130/85', hr: '72', weight: '68kg', temp: '36.7°C' },
    { id: '2', date: 'Jan 28, 2026', bp: '128/82', hr: '75', weight: '69kg', temp: '36.8°C' },
  ];

  return (
    <div>
      <h3 style={{ marginTop: 0, color: 'var(--color-text)' }}>Recent Measurements</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mockVitalRecords.map(r => (
          <div key={r.id} style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text)' }}>{r.date}</div>
            </div>
            <div style={{ color: 'var(--color-neutral-9)', fontSize: 14, fontWeight: 600 }}>BP: {r.bp} • HR: {r.hr} Weight: {r.weight} • Temp: {r.temp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = { card: { backgroundColor: 'var(--color-surface)', padding: 16, borderRadius: 8 } };

export default VitalsTab;

