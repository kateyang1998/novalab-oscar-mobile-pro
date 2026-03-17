import React from 'react';
import PatientCard from './PatientCard';

const PatientGrid = ({ patients = [], onPatientClick }) => {
  return (
	<div style={styles.grid}>
	  {patients.map(p => (
		<PatientCard key={p.id} patient={p} onClick={onPatientClick} />
	  ))}
	</div>
  );
};

const styles = {
  grid: {
	display: 'grid',
	gridTemplateColumns: 'repeat(2, 1fr)',
	gap: 16,
  },
};

export default PatientGrid;


