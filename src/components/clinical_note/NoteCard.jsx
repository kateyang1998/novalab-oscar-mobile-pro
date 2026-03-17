import React from 'react';

// Reusable note card used in notes lists and other places
export default function NoteCard({ note = {}, onClick }) {
  return (
    <div style={styles.noteCard} onClick={() => onClick?.(note.id)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 400, color: 'var(--color-text)' }}>{note.date}</div>
        <div style={{ color: 'var(--color-text)', fontSize: 14, fontWeight: 400 }}>{note.doctor}</div>
        <div style={styles.statusBadge}>{note.status ?? 'Synced'}</div>
      </div>
      <div style={{ color: 'var(--color-primary)', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{note.title ?? 'SOAP Note'}</div>
      <div style={{ color: 'var(--color-neutral-7)', fontSize: 14, fontWeight: 400 }}>{note.preview}</div>
    </div>
  );
}

const styles = {
  noteCard: { backgroundColor: 'var(--color-surface)', padding: 16, borderRadius: 8, cursor: 'pointer' },
  statusBadge: { marginLeft: 'auto', backgroundColor: 'var(--oscar-green)', color: '#ffffff', padding: '4px 8px', borderRadius: 8, fontSize: 12, fontWeight: 600 },
};

