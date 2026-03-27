// src/test/screens/PatientRecordScreen.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import PatientRecordScreen from '../../screens/PatientRecordScreen';

// Mock hooks
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  };
});

// Mock components
vi.mock('../../components/layout/TopHeader', () => ({
  default: ({ title, onBack }) => (
    <div data-testid="top-header">
      <button data-testid="back-button" onClick={onBack}>Back</button>
      <span>{title}</span>
    </div>
  ),
}));

vi.mock('../../components/patient/PatientTopSections', () => ({
  default: ({ patient }) => (
    <div data-testid="patient-top-sections">
      <span>{patient.name}</span>
    </div>
  ),
}));

vi.mock('../../components/patient/TabNav', () => ({
  default: ({ activeTab, onChange }) => (
    <div data-testid="tab-nav">
      <button data-testid="tab-summary" onClick={() => onChange('summary')}>Summary</button>
      <button data-testid="tab-notes" onClick={() => onChange('notes')}>Notes</button>
      <span>Active: {activeTab}</span>
    </div>
  ),
}));

vi.mock('../../components/patient/tabs/SummaryTab', () => ({
  default: ({ patientId }) => <div data-testid="summary-tab">Summary Tab: {patientId}</div>,
}));

vi.mock('../../components/patient/tabs/NotesTab', () => ({
  default: ({ patientId }) => <div data-testid="notes-tab">Notes Tab: {patientId}</div>,
}));

vi.mock('../../components/patient/tabs/HistoryTab', () => ({
  default: ({ patientId }) => <div data-testid="history-tab">History Tab: {patientId}</div>,
}));

vi.mock('../../components/patient/tabs/VitalsTab', () => ({
  default: ({ patientId }) => <div data-testid="vitals-tab">Vitals Tab: {patientId}</div>,
}));

global.fetch = vi.fn();

describe('PatientRecordScreen', () => {
  const mockPatient = {
    id: '123',
    name: 'John Doe',
    age: 30,
    gender: 'Male',
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseParams.mockReturnValue({ id: '123' });
    mockUseLocation.mockReturnValue({ pathname: '/patient/123/summary' });
    global.fetch.mockClear();
    global.fetch.mockImplementation(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockPatient) })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <PatientRecordScreen />
    </BrowserRouter>
  );

  it('shows loading state initially', () => {
    renderComponent();
    expect(screen.getByText('Loading patient data...')).toBeInTheDocument();
  });

  it('fetches and displays patient data', async () => {
    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/patients/123');
      expect(screen.getByTestId('patient-top-sections')).toHaveTextContent('John Doe');
    });
  });

  it('shows error state when patient not found', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: false })
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Patient not found')).toBeInTheDocument();
    });
  });

  it('shows error state when API fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('displays Summary tab by default', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('summary-tab')).toBeInTheDocument();
    });
  });

  it('switches tabs when clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('tab-summary')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('tab-notes'));

    expect(mockNavigate).toHaveBeenCalledWith('/patient/123/notes', { replace: true });
  });
});