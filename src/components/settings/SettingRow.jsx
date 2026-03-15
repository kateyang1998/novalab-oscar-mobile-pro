import React from 'react';
import theme from '../../styles/theme';
import { IconChevronRight } from '../common/Icons';

const SettingRow = ({ label, description, first, last, onClick, showToggle, toggleOn, onToggle }) => {
  const rowStyle = {
    backgroundColor: theme.colors.oscarWhite,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: first || !last ? `1px solid ${theme.colors.oscarWhite}` : 'none',
    cursor: onClick ? 'pointer' : 'default',
  };

  return (
    <div style={rowStyle} onClick={onClick}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 16, color: theme.colors.oscarBlack, marginBottom: 4 }}>{label}</span>
        {description && <span style={{ fontSize: 14, color: theme.colors.paleSky }}>{description}</span>}
      </div>

      {showToggle ? (
        <div
          style={{ width: 44, height: 26, borderRadius: 13, position: 'relative', backgroundColor: toggleOn ? theme.colors.oscarBlue : theme.colors.oscarGray, cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); onToggle && onToggle(); }}
        >
          <div style={{ width: 22, height: 22, backgroundColor: theme.colors.oscarWhite, borderRadius: 11, position: 'absolute', top: 2, left: toggleOn ? 20 : 2, transition: 'transform 0.2s' }} />
        </div>
      ) : (
        <IconChevronRight size={20} color={theme.colors.paleSky} />
      )}
    </div>
  );
};

export default SettingRow;

