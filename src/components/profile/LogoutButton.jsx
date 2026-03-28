import React from 'react';
import theme from '../../styles/theme';

const LogoutButton = ({ onLogout }) => {
  return (
	<button style={styles.logoutButton} onClick={onLogout}>
	  Logout
	</button>
  );
};

const styles = {
  logoutButton: {
	width: '100%',
	padding: '16px',
	backgroundColor: theme.colors.oscarRed,
	color: theme.colors.oscarWhite,
	border: 'none',
	borderRadius: 12,
	fontSize: 16,
	fontWeight: 600,
	cursor: 'pointer',
	marginBottom: 20,
  },
};

export default LogoutButton;


