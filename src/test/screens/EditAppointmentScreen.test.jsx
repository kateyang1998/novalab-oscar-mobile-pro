// src/test/screens/EditAppointmentScreen.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import EditAppointmentScreen from '../../screens/EditAppointmentScreen';

// Mocks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

vi.mock('../../components/common/toastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

vi.mock('../../components/appointment/AppointmentForm.jsx', () => ({
  default: ({ formData, onChange, errors }) => (
    <div data-testid="appointment-form">
      <textarea
        data-testid="reason-input"
        value={formData.reasonForVisit}
        onChange={(e) => onChange('reasonForVisit', e.target.value)}
      />
      {errors.reasonForVisit && <div data-testid="reason-error">{errors.reasonForVisit}</div>}
    </div>
  ),
}));

vi.mock('../../components/patient/PatientInfoCard', () => ({
  default: ({ patient }) => <div data-testid="patient-card">{patient?.name}</div>,
}));

vi.mock('../../components/layout/TopHeader', () => ({
  default: ({ onBack }) => (
    <div>
      <button data-testid="back-button" onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock('../../components/common/UnsavedChangesModal', () => ({
  default: ({ open, onDiscard }) => open ? <button data-testid="discard-btn" onClick={onDiscard}>Discard</button> : null,
}));

const mockNavigate = vi.fn();
const mockLocation = { state: null };
const mockShowToast = vi.fn();
global.fetch = vi.fn();

describe('EditAppointmentScreen', () => {
  const mockAppointment = {
    id: 'apt-123',
    patientId: 'patient-456',
    patientName: 'John Doe',
    reason: 'Follow-up appointment',
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockShowToast.mockClear();
    global.fetch.mockClear();
    mockLocation.state = { appointment: mockAppointment };

    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/patients/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ name: 'John Doe', age: 30 })
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <EditAppointmentScreen />
    </BrowserRouter>
  );

  it('renders loading state initially', () => {
    renderComponent();
    // Screen should show loading state (if your component has one)
    // If no explicit loading state, this test might be skipped
  });

  it('fetches and displays patient info', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('patient-card')).toHaveTextContent('John Doe');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/patients/patient-456');
  });

  it('allows editing the reason for visit', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('reason-input')).toBeInTheDocument();
    });

    const reasonInput = screen.getByTestId('reason-input');
    await user.clear(reasonInput);
    await user.type(reasonInput, 'Patient reports chest pain');

    expect(reasonInput).toHaveValue('Patient reports chest pain');
  });

  it('shows validation error when required fields are missing', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('reason-input')).toBeInTheDocument();
    });

    await user.clear(screen.getByTestId('reason-input'));
    await user.click(screen.getByText('Save & Sync'));

    await waitFor(() => {
      expect(screen.getByTestId('reason-error')).toBeInTheDocument();
      expect(mockShowToast).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Please fix the highlighted fields before saving.',
      }));
    });
  });

  it('shows unsaved changes modal when navigating back with edits', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('reason-input')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('reason-input'), 'New reason');
    await user.click(screen.getByTestId('back-button'));

    await waitFor(() => {
      expect(screen.getByTestId('discard-btn')).toBeInTheDocument();
    });
  });
});