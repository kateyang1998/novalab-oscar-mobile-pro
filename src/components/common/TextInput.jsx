import React from 'react';

const TextInput = ({ label, type = 'text', value, onChange, placeholder }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input
        className="form-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextInput;

