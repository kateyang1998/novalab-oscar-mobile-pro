import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconPlus } from '../../common/Icons';

const NotesTab = ({ patientId }) => {
  const navigate = useNavigate();
  const mockNotes = [
    { id: '1', date: 'Feb 9, 2026', doctor: 'Dr.Lee', preview: 'Follow-up for diabetes management...' },
    { id: '2', date: 'Jan 28, 2026', doctor: 'Dr.Smith', preview: 'Blood pressure check and medication review...' },
  ];

  const handleAdd = () => navigate(`/clinical-note?patientId=${patientId}`);
  const openNote = (noteId) => navigate(`/clinical-note?patientId=${patientId}&noteId=${noteId}`);

  return (
    <div>
      <button className="btn btn-primary" style={{ width: '100%', marginBottom: 16, padding: '16px', fontSize: 15 }} onClick={handleAdd}>
        <IconPlus size={18} color="var(--color-surface)" />&nbsp;Add Note
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mockNotes.map(n => (
          <div key={n.id} style={styles.noteCard} onClick={() => openNote(n.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 400, color: 'var(--color-text)' }}>{n.date}</div>
              <div style={{ color: 'var(--color-text)', fontSize: 14, fontWeight: 400, }}>{n.doctor}</div>
              <div style={styles.statusBadge}>Synced</div>
            </div>
            <div style={{ color: 'var(--color-primary)', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>SOAP Note</div>
            <div style={{ color: 'var(--color-neutral-7)', fontSize: 14, fontWeight: 400 }}>{n.preview}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  noteCard: { backgroundColor: 'var(--color-surface)', padding: 16, borderRadius: 8, cursor: 'pointer' },
  statusBadge: { marginLeft: 'auto', backgroundColor: 'var(--oscar-green)', color: '#ffffff', padding: '4px 8px', borderRadius: 8, fontSize: 12, fontWeight: 600 },
};

export default NotesTab;


