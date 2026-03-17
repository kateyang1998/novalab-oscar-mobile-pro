import React from 'react';
import { IconChevronRight } from '../common/Icons';
import theme from '../../styles/theme';
import { useNavigate } from 'react-router-dom';

const RecentPatients = ({ patients = [] }) => {
  const navigate = useNavigate();

  const top3 = patients.slice(0, 3);

  return (
    <div style={styles.container}>
      {top3.map((p) => (
        <div key={p.id} style={styles.item} onClick={() => navigate(`/patient/${p.id}/summary`)}>
          <div style={styles.info}>
            <p style={styles.name}>{p.name}</p>
            <p style={styles.details}>ID: {p.id} • {p.time}</p>
          </div>
          <IconChevronRight size={20} color={theme.colors.paleSky} />
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: 10 },
  item: {
    padding: '12px 16px',
    border: `1px solid ${theme.colors.oscarWhite}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.oscarGray,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
  },
  info: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: 700, margin: 0, color: theme.colors.oscarBlack },
  details: { fontSize: 12, color: theme.colors.paleSky, margin: 0 },
};

export default RecentPatients;

