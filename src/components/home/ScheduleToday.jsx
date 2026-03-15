import React from 'react';
import { useNavigate } from 'react-router-dom';
import theme from '../../styles/theme';
import { IconCheck, IconX, IconChevronRight } from '../common/Icons';

// ScheduleToday: Displays list of today's appointments. Props:
// - items: array of appointments { id, patientName, type, startTime, status }
// - onEmptyText: optional text to show when no items
const ScheduleToday = ({ items = [], emptyText = 'No schedule for today yet' }) => {
  const navigate = useNavigate();

  function handleItemClick(item) {
    // Navigate to edit appointment screen passing appointment in state
    navigate('/appointment/edit', { state: { appointment: item } });
  }

  if (!items || items.length === 0) {
    return (
      <div style={styles.container}>
        <p style={styles.emptyText}>{emptyText}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
              {items.map((it) => (
                (() => {
                  const isCancelled = it.status && it.status.toLowerCase() === 'cancelled';
                  const itemStyle = { ...styles.item, ...(isCancelled ? styles.itemCancelled : {}) };
                  const nameStyle = { ...styles.patientName, ...(isCancelled ? styles.textCancelled : {}) };
                  const typeStyle = { ...styles.type, color: getTypeColor(it.type), ...(isCancelled ? styles.textCancelled : {}) };

                  return (
                    <div key={it.id} style={itemStyle} onClick={() => handleItemClick(it)}>
                      <span style={styles.time}>{it.startTime}</span>
                      <div style={styles.details}>
                        <p style={nameStyle}>{it.patientName}</p>
                        <p style={typeStyle}>{it.type}</p>
                      </div>
                      <div style={styles.statusCol}>
                        {it.status && it.status.toLowerCase() === 'finished' && (
                          <IconCheck size={16} color={theme.colors.oscarGreen} />
                        )}
                        {it.status && it.status.toLowerCase() === 'cancelled' && (
                          <IconX size={16} color={theme.colors.oscarRed} />
                        )}
                        {it.status && it.status.toLowerCase() !== 'finished' && it.status.toLowerCase() !== 'cancelled' && (
                          <span style={styles.dot}>•</span>
                        )}

                        <span style={getStatusTextStyle(it.status)}>{it.status}</span>
                        <IconChevronRight size={18} color={theme.colors.paleSky} style={{ marginLeft: 8 }} />
                      </div>
                    </div>
                  );
                })()
              ))}
    </div>
  );
};

        function getTypeColor(type) {
  const map = theme.colors.appointment || {};
  switch ((type || '').toLowerCase()) {
    case 'new patient':
    case 'new':
    case 'newpatient':
      return map.newPatient;
    case 'follow up':
    case 'follow-up':
    case 'followup':
      return map.followUp;
    case 'physical':
      return map.physical;
    case 'consultation':
      return map.consultation;
    case 'urgent care':
    case 'urgentcare':
      return map.urgentCare;
    default:
      return theme.colors.oscarBlue;
  }
}
function getStatusTextStyle(status) {
  if (!status) return {};
  if (status.toLowerCase() === 'finished') return { fontSize: 12, color: theme.colors.oscarGreen };
  if (status.toLowerCase() === 'cancelled') return { fontSize: 12, color: theme.colors.oscarRed };
  return { fontSize: 12, color: theme.colors.paleSky };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.oscarGray,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  emptyText: {
    padding: '20px',
    color: theme.colors.paleSky,
    textAlign: 'center',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    minHeight: '60px',
    borderBottom: `1px dashed ${theme.colors.oscarWhite}`,
    backgroundColor: theme.colors.oscarGray,
  },
  itemCancelled: {
    opacity: 0.5,
    backgroundColor: theme.colors.oscarGray,
  },
  textCancelled: {
    textDecoration: 'line-through',
    opacity: 0.6,
  },
  time: { fontSize: 14, fontWeight: 700, minWidth: 70, color: theme.colors.oscarBlack },
  details: { flex: 1, marginLeft: 12, marginRight: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  patientName: { fontSize: 14, fontWeight: 700, margin: '0 0 2px 0', color: theme.colors.oscarBlack },
  type: { fontSize: 12, margin: 0 },
  statusCol: { display: 'flex', alignItems: 'center', gap: 6, minWidth: 80, justifyContent: 'flex-end' },
  dot: { fontSize: 16, color: theme.colors.paleSky },
};

export default ScheduleToday;

