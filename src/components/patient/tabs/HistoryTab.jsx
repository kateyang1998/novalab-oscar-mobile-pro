import React, { useState, useEffect } from 'react';

const HistoryTab = ({ patientId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    fetch(`/api/patients/${patientId}/history`)
      .then(r => r.json())
      .then(data => {
        setHistory(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setHistory([]);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) {
    return <p style={styles.empty}>Loading history...</p>;
  }

  return (
    <div>
      {history.length === 0 ? (
        <p style={styles.empty}>No visit history found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {history.map(v => (
            <div key={v.id} style={styles.card}>
              <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--pale-sky)' }}>{v.date}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{v.visitType}</div>
              <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-neutral-7)' }}>{v.doctor}</div>
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

export default HistoryTab;
