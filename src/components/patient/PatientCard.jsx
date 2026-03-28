import React from 'react';
import theme from '../../styles/theme';
import { IconUser, IconChevronRight } from '../common/Icons';

const PatientCard = ({ patient, onClick }) => {
  return (
    <div style={styles.card} onClick={() => onClick?.(patient.id)}>
        <div style={styles.info}>
          <h3 style={styles.name}>{patient.name}</h3>
          <p style={styles.meta}>ID: {patient.id}</p>
          <p style={styles.meta}>{patient.age} years old • {patient.gender}</p>
          <p style={styles.meta}>DOB: {patient.dob}</p>
          <p style={styles.meta}>Last Visit: {patient.lastVisit}</p>
        </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: theme.colors.oscarWhite,
    borderRadius: theme.radius.md,
    padding: 16,
    boxShadow: theme.shadows.sm,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  left: { display: 'flex', gap: 12, alignItems: 'center', flex: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.oscarBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  info: { display: 'flex', flexDirection: 'column', gap: 4 },
  name: { fontSize: theme.font.sizes.lg, fontWeight: theme.font.weights.bold, color: theme.colors.oscarBlack, margin: 0 },
  meta: { fontSize: theme.font.sizes.sm, color: theme.colors.paleSky, margin: 0 },
  right: { flexShrink: 0, marginLeft: 8 },
};

export default PatientCard;

