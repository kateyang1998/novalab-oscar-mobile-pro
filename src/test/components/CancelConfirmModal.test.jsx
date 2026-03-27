import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CancelConfirmModal from '../../components/appointment/CancelConfirmModal';

describe('CancelConfirmModal', () => {
  const appointment = {
    patientId: 'P-0001',
    patientName: 'John Doe',
    date: '2023-12-01',
    startTime: '09:30',
    type: 'Consultation',
  };

  it('renders details and wires confirm/dismiss callbacks', () => {
    const onConfirm = vi.fn();
    const onDismiss = vi.fn();

    render(<CancelConfirmModal appointment={appointment} onConfirm={onConfirm} onDismiss={onDismiss} />);

    expect(screen.getByText(/Are you sure you want to cancel an appointment/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Consultation/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Yes'));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});


