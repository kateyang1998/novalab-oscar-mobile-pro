import React from 'react';

const HistoryTab = ({ patientId }) => {
  const mockVisits = [
    { id: '1', date: 'Feb 9, 2026', visitType: 'Routine follow-up visit', doctor: 'Dr.Lee' },
    { id: '2', date: 'Jan 28, 2026', visitType: 'Checkup', doctor: 'Dr.Lee' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mockVisits.map(v => (
          <div key={v.id} style={styles.card}>
            <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--pale-sky)' }}>{v.date}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{v.visitType}</div>
            <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-neutral-7)' }}>{v.doctor}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = { card: { backgroundColor: 'var(--color-surface)', padding: 16, borderRadius: 8 } };

export default HistoryTab;

