import React from 'react';
import theme from '../../styles/theme';
import { IconUser } from '../common/Icons';

const UserProfileCard = ({ name = 'Dr. Full Name', specialty = 'Family Physician', email='adkfij@oscar.ca', id='CL001234' }) => {
  return (
    <div style={styles.card}>
      <div style={styles.icon}>
        <div style={styles.avatar}>
          <IconUser size={32} color={theme.colors.oscarWhite} />
        </div>
      </div>
      <div style={styles.info}>
        <h2 style={styles.name}>{name}</h2>
        <p style={styles.specialty}>{specialty}</p>
        <p style={styles.email}>{email}</p>
        <p style={styles.id}>ID: {id}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: theme.colors.oscarWhite,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  icon: { flexShrink: 0 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.paleSky, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 20, fontWeight: 700, color: theme.colors.oscarBlack, margin: '0 0 4px 0' },
  specialty: { fontSize: 14, color: theme.colors.paleSky, margin: '0 0 4px 0' },
  email: { fontSize: 14, color: theme.colors.paleSky, margin: '0 0 4px 0' },
  id: { fontSize: 14, color: theme.colors.paleSky, margin: 0 },
};

export default UserProfileCard;


