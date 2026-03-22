import React from 'react';

// Simple controlled text input that supports an `error` prop to show error styling
const TextInput = ({ label, type = 'text', value, onChange, placeholder, id, error }) => {
  const hasError = !!error;
  const inputClass = `form-input ${hasError ? 'form-input--error' : ''}`;

  return (
    <div className="form-group">
      {label && <label className="form-label" htmlFor={id}>{label}</label>}
      <input
        id={id}
        className={inputClass}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={hasError}
        aria-describedby={hasError && id ? `${id}-error` : undefined}
      />
      {hasError && id && typeof error === 'string' && (
        <div id={`${id}-error`} className="form-subtle" role="alert" style={{ color: 'var(--oscar-red)', marginTop: 4, fontSize: '12px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default TextInput;

