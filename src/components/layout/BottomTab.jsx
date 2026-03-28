import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconUsers, IconCalendar, IconInbox } from '../common/Icons';

const BottomTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Home', path: '/home', icon: (isActive) => <IconHome color={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} /> },
    { name: 'Patients', path: '/patients', icon: (isActive) => <IconUsers color={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} /> },
    { name: 'Schedule', path: '/schedule', icon: (isActive) => <IconCalendar color={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} /> },
    { name: 'Inbox', path: '/inbox', icon: (isActive) => <IconInbox color={isActive ? 'var(--color-primary)' : 'var(--color-neutral-7)'} /> },
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

