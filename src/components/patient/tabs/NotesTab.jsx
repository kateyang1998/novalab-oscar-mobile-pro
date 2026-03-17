import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddNoteButton from '../../../components/clinical_note/AddNoteButton';
import NoteCard from '../../../components/clinical_note/NoteCard';

const NotesTab = ({ patientId }) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    fetch(`/api/patients/${patientId}/notes`)
      .then(r => r.json())
      .then(data => {
        setNotes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setNotes([]);
        setLoading(false);
      });
  }, [patientId]);

  const handleAdd    = () => navigate(`/clinical-note?patientId=${patientId}`);
  const openNote = (noteId) => navigate(`/clinical-note?patientId=${patientId}&noteId=${noteId}`);

  if (loading) {
    return <p style={styles.empty}>Loading notes...</p>;
  }

  return (
    <div>
      <AddNoteButton onClick={handleAdd} />
      {notes.length === 0 ? (
        <p style={styles.empty}>No clinical notes yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notes.map(n => (
            <NoteCard
              key={n.id}
              note={{ ...n, status: n.status, title: n.title }}
              onClick={() => openNote(n.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  empty: { fontSize: 13, color: 'var(--color-neutral-7)', padding: '16px 0' },
};

export default NotesTab;
