import React, { useState, useEffect } from 'react';

const VitalsTab = ({ patientId }) => {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    fetch(`/api/patients/${patientId}/vitals`)
      .then(r => r.json())
      .then(data => {
        setVitals(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setVitals([]);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) {
    return <p style={styles.empty}>Loading vitals...</p>;
  }

  return (
    <div>
      <h3 style={{ marginTop: 0, color: 'var(--color-text)' }}>Recent Measurements</h3>
      {vitals.length === 0 ? (
        <p style={styles.empty}>No vital signs recorded.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {vitals.map(r => (
            <div key={r.id} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text)' }}>{r.date}</div>
              </div>
              <div style={{ color: 'var(--color-neutral-9)', fontSize: 14, fontWeight: 600 }}>
                BP: {r.bp} • HR: {r.hr} • Weight: {r.weight} • Temp: {r.temp}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  card:  { backgroundColor: 'var(--color-surface)', padding: 16, borderRadius: 8 },
  empty: { fontSize: 13, color: 'var(--color-neutral-7)', padding: '16px 0' },
};

export default VitalsTab;
