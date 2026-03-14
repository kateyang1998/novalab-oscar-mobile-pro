import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Home', path: '/home', icon: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
          stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          fill={isActive ? 'var(--color-primary)' : 'none'} />
        <path d="M9 22V12H15V22" stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
    { name: 'Patients', path: '/patients', icon: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
          stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
          stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
          stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
          stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
    { name: 'Schedule', path: '/schedule', icon: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 2V6" stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 2V6" stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 10H21" stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
    { name: 'Inbox', path: '/inbox', icon: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12H16L14 15H10L8 12H2" stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z"
          stroke={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
  ];

  const handleTabPress = (path) => navigate(path);

  return (
    <div style={styles.container}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.path === '/patients' && location.pathname.startsWith('/patient/'));
        return (
          <button key={tab.name} onClick={() => handleTabPress(tab.path)} style={styles.tabButton}>
            <div style={styles.iconContainer}>{tab.icon(isActive)}</div>
            <span style={{ ...styles.label, color: isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)' }}>{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '390px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'var(--oscar-white, #F8F9FA)',
    borderTop: '1px solid var(--color-neutral-2)',
    paddingTop: '8px',
    paddingBottom: '20px',
    zIndex: 1000,
  },
  tabButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    minWidth: '60px',
  },
  iconContainer: { marginBottom: '4px' },
  label: { fontSize: '10px', fontWeight: 500, marginTop: '2px' },
};

export default BottomTab;

