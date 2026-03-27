import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NoteCard from '../../components/clinical_note/NoteCard';

describe('NoteCard', () => {
  const note = {
    id: 42,
    date: '2023-12-01',
    doctor: 'Dr. Who',
    status: 'Draft',
    title: 'Assessment',
    preview: 'Patient is improving',
  };

  it('renders note details and calls onClick with id', () => {
    const onClick = vi.fn();
    render(<NoteCard note={note} onClick={onClick} />);

    expect(screen.getByText('2023-12-01')).toBeInTheDocument();
    expect(screen.getByText('Dr. Who')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getByText('Patient is improving')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Assessment'));
    expect(onClick).toHaveBeenCalledWith(42);
  });
});

