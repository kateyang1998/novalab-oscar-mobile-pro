import React from 'react';
import theme from '../../styles/theme';

const PatientInfoCard = ({ patient }) => {
  if (!patient) return null;

  return (
    <div style={styles.patientInfoCard}>
      <h2 style={styles.patientName}>{patient.name}</h2>
      <p style={styles.patientDetail}>ID: {patient.id}</p>
      <p style={styles.patientDetail}>{patient.age} years old • {patient.gender}</p>
      <p style={styles.patientDetail}>DOB: {patient.dob}</p>
      <p style={styles.patientDetail}>Phone: {patient.phone}</p>
    </div>
  );
};

const styles = {
  patientInfoCard: {
    backgroundColor: theme.colors.oscarWhite,
    borderRadius: theme.radius.md,
    padding: 20,
    marginBottom: 16,
  },
  patientName: { fontSize: 24, fontWeight: 700, color: theme.colors.oscarBlack, margin: '0 0 8px 0' },
  patientDetail: { fontSize: 14, color: theme.colors.paleSky, margin: '4px 0' },
};

export default PatientInfoCard;

