import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddNoteButton from '../../../components/clinical_note/AddNoteButton';
import NoteCard from '../../../components/clinical_note/NoteCard';

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
      <AddNoteButton onClick={handleAdd} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mockNotes.map(n => (
          <NoteCard key={n.id} note={{ ...n, status: 'Synced', title: 'SOAP Note' }} onClick={() => openNote(n.id)} />
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


