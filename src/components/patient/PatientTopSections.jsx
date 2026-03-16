import React from 'react';
import theme from '../../styles/theme';
import { IconAlert } from '../common/Icons';
import PatientInfoCard from './PatientInfoCard';

const PatientTopSections = ({ patient }) => {
  return (
    <div>
      <PatientInfoCard patient={patient} />

      {patient.allergies && patient.allergies.length > 0 && (
        <div style={styles.allergiesCard}>
          <div style={styles.allergiesHeader}>
            <IconAlert size={20} color={theme.colors.yukonGold} style={styles.warningIcon} />
            <span style={styles.allergiesTitle}>Allergies</span>
          </div>
          <p style={styles.allergiesList}>{patient.allergies.join(', ')}</p>
        </div>
      )}

      {patient.emergencyContact && (
        <p style={styles.emergencyContact}>
          Emergency Contact: {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}
        </p>
      )}
    </div>
  );
};

const styles = {
  // patientInfoCard styles moved to PatientInfoCard.jsx
  allergiesCard: { backgroundColor: theme.colors.oscarYellow, borderRadius: theme.radius.md, padding: 16, marginBottom: 16, border: `1px solid ${theme.colors.yukonGold}` },
  allergiesHeader: { display: 'flex', alignItems: 'center', marginBottom: 8 },
  warningIcon: { marginRight: 8 },
  allergiesTitle: { fontSize: 16, fontWeight: 600, color: theme.colors.yukonGold },
  allergiesList: { fontSize: 14, color: theme.colors.oscarBlack, margin: 0 },
  emergencyContact: { fontSize: 13, color: theme.colors.paleSky, marginBottom: 20 },
};

export default PatientTopSections;


