import React from 'react';
import theme from '../../styles/theme';
import { IconSearch } from './Icons';

// Reusable search bar used across screens (matches PatientsScreen behavior)
const SearchBar = ({ value, onChange, placeholder = 'Search patients' }) => {
  return (
    <div style={styles.container}>
      <IconSearch size={20} color={theme.colors.paleSky} style={styles.icon} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  icon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    fontSize: theme.font.sizes.md,
    border: `1px solid ${theme.colors.oscarGray}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.oscarWhite,
    boxSizing: 'border-box',
    outline: 'none',
    color: theme.colors.oscarBlack,
  },
};

export default SearchBar;

