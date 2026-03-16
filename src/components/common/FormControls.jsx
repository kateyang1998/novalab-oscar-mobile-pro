import React from 'react';
import theme from '../../styles/theme';

// Simple styled text input wrapper
export const TextInput = ({ style, ...props }) => {
  const base = {
    width: '100%',
    padding: 12,
    fontSize: 14,
    border: `1px solid ${theme.colors.oscarGray}`,
    borderRadius: 8,
    backgroundColor: theme.colors.oscarWhite,
    boxSizing: 'border-box',
    outline: 'none',
  };
  return <input {...props} style={{ ...base, ...style }} />;
};

export const SelectInput = ({ style, children, ...props }) => {
  const base = {
    width: '100%',
    padding: 12,
    fontSize: 14,
    border: `1px solid ${theme.colors.oscarGray}`,
    borderRadius: 8,
    backgroundColor: theme.colors.oscarWhite,
    boxSizing: 'border-box',
    outline: 'none',
    cursor: 'pointer',
  };
  return (
    <select {...props} style={{ ...base, ...style }}>
      {children}
    </select>
  );
};

export const TextAreaInput = ({ style, ...props }) => {
  const base = {
    width: '100%',
    padding: 12,
    fontSize: 14,
    border: `1px solid ${theme.colors.oscarGray}`,
    borderRadius: 8,
    backgroundColor: theme.colors.oscarWhite,
    boxSizing: 'border-box',
    outline: 'none',
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit',
  };
  return <textarea {...props} style={{ ...base, ...style }} />;
};

export const CheckboxInput = ({ style, ...props }) => {
  const base = {
    width: 18,
    height: 18,
    marginRight: 10,
    cursor: 'pointer',
  };
  return <input type="checkbox" {...props} style={{ ...base, ...style }} />;
};

export default { TextInput, SelectInput, TextAreaInput, CheckboxInput };

