import React from 'react';
import { IconPlus } from '../common/Icons';

// Reusable Add Note button used across screens
export default function AddNoteButton({ onClick, label = 'Add Note', style = {}, className = '' }) {
  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={onClick}
      style={{ width: '100%', marginBottom: 16, padding: '16px', fontSize: 15, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, ...style }}
    >
      <IconPlus size={18} color="var(--color-surface)" />
      <span>{label}</span>
    </button>
  );
}

