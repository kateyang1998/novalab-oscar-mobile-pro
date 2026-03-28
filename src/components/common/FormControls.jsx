import React from 'react';
import theme from '../../styles/theme';

// Simple styled text input wrapper
// Form header used above grouped sections
export const FormHeader = ({ children, style = {} }) => (
  <h3
    style={{
      fontFamily: theme.font.family,
      // ClinicalNoteScreen uses section titles around 16px / 700 weight
      fontSize: theme.font.sizes.md,
      fontWeight: theme.font.weights.bold,
      color: theme.colors.oscarBlue,
      margin: '0 0 8px 0',
      ...style,
    }}
  >
    {children}
  </h3>
);

// Standard label used for form fields
export const FormLabel = ({ children, htmlFor, style = {} }) => (
  <label
    htmlFor={htmlFor}
    style={{
      display: 'block',
      fontFamily: theme.font.family,
      // ClinicalNoteScreen label style: 14px, 600
      fontSize: theme.font.sizes.sm,
      fontWeight: 600,
      color: theme.colors.shark,
      marginBottom: 6,
      paddingLeft: 6,
      ...style,
    }}
  >
    {children}
  </label>
);

export const TextInput = ({ style, error, id, ...props }) => {
  const base = {
    width: '100%',
    padding: 12,
    // ClinicalNoteScreen uses 14px inputs
    fontSize: theme.font.sizes.sm,
    fontFamily: theme.font.family,
    fontWeight: theme.font.weights.regular,
    border: `1px solid ${error ? theme.colors.oscarRed : theme.colors.oscarGray}`,
    borderRadius: 8,
    backgroundColor: theme.colors.oscarWhite,
    boxSizing: 'border-box',
    outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <input id={id} aria-invalid={!!error} aria-describedby={error && id ? `${id}-error` : undefined} {...props} style={{ ...base, ...style }} />
      {error && (
        <div id={`${id}-error`} style={{ color: theme.colors.oscarRed, fontSize: theme.font.sizes.xs, marginTop: 4 }} role="alert">{error}</div>
      )}
    </div>
  );
};

export const SelectInput = ({ style, children, error, id, ...props }) => {
  const base = {
    width: '100%',
    padding: 12,
    fontSize: theme.font.sizes.sm,
    fontFamily: theme.font.family,
    fontWeight: theme.font.weights.regular,
    border: `1px solid ${error ? theme.colors.oscarRed : theme.colors.oscarGray}`,
    borderRadius: 8,
    backgroundColor: theme.colors.oscarWhite,
    boxSizing: 'border-box',
    outline: 'none',
    cursor: 'pointer',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <select id={id} aria-invalid={!!error} aria-describedby={error && id ? `${id}-error` : undefined} {...props} style={{ ...base, ...style }}>
        {children}
      </select>
      {error && (
        <div id={`${id}-error`} style={{ color: theme.colors.oscarRed, fontSize: theme.font.sizes.xs, marginTop: 4 }} role="alert">{error}</div>
      )}
    </div>
  );
};

export const TextAreaInput = ({ style, error, id, ...props }) => {
  const base = {
    width: '100%',
    padding: 12,
    fontSize: theme.font.sizes.sm,
    fontFamily: theme.font.family,
    fontWeight: theme.font.weights.regular,
    border: `1px solid ${error ? theme.colors.oscarRed : theme.colors.oscarGray}`,
    borderRadius: 8,
    backgroundColor: theme.colors.oscarWhite,
    boxSizing: 'border-box',
    outline: 'none',
    minHeight: '100px',
    resize: 'vertical',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <textarea id={id} aria-invalid={!!error} aria-describedby={error && id ? `${id}-error` : undefined} {...props} style={{ ...base, ...style }} />
      {error && (
        <div id={`${id}-error`} style={{ color: theme.colors.oscarRed, fontSize: theme.font.sizes.xs, marginTop: 4 }} role="alert">{error}</div>
      )}
    </div>
  );
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

export default { TextInput, SelectInput, TextAreaInput, CheckboxInput, FormLabel, FormHeader };

