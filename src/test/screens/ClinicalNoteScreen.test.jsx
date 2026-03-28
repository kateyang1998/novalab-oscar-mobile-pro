// src/test/screens/ClinicalNoteScreen.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ClinicalNoteScreen from '../../screens/ClinicalNoteScreen';

// Mock dependencies
const mockNavigate = vi.fn();
const mockSearchParams = new URLSearchParams({ patientId: 'P-0021', noteId: '' });

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams, vi.fn()],
  };
});

// Mock all child components
vi.mock('../../components/layout/TopHeader', () => ({
  default: ({ title, onBack }) => (
    <div data-testid="top-header">
      <button data-testid="back-button" onClick={onBack}>Back</button>
      <span>{title}</span>
    </div>
  ),
}));

vi.mock('../../components/patient/PatientInfoCard', () => ({
  default: ({ patient }) => (
    <div data-testid="patient-info-card">
      <span>{patient?.name || 'No patient'}</span>
    </div>
  ),
}));

vi.mock('../../components/common/FormSection', () => ({
  default: ({ title, children }) => (
    <div data-testid={`section-${title}`}>
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

vi.mock('../../components/common/FormControls', () => ({
  TextInput: ({ value, onChange, placeholder, error, id }) => (
    <div>
      <input
        data-testid={`input-${id}`}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <div data-testid={`error-${id}`}>{error}</div>}
    </div>
  ),
  SelectInput: ({ value, onChange, children, error, id }) => (
    <div>
      <select data-testid={`select-${id}`} value={value || ''} onChange={onChange}>
        {children}
      </select>
      {error && <div data-testid={`error-${id}`}>{error}</div>}
    </div>
  ),
  TextAreaInput: ({ value, onChange, placeholder, error, id }) => (
    <div>
      <textarea
        data-testid={`textarea-${id}`}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <div data-testid={`error-${id}`}>{error}</div>}
    </div>
  ),
  CheckboxInput: ({ checked, onChange }) => (
    <input type="checkbox" checked={checked || false} onChange={onChange} data-testid="checkbox" />
  ),
  FormLabel: ({ children }) => <label>{children}</label>,
}));

vi.mock('../../components/common/UnsavedChangesModal', () => ({
  default: ({ open, onDiscard }) => (
    open ? <div data-testid="unsaved-modal"><button data-testid="discard-btn" onClick={onDiscard}>Discard</button></div> : null
  ),
}));

vi.mock('../../components/common/toastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

const mockShowToast = vi.fn();
global.fetch = vi.fn();

describe('ClinicalNoteScreen', () => {
  const mockPatient = {
    id: 'P-0021',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockShowToast.mockClear();
    global.fetch.mockClear();
    mockSearchParams.set('patientId', 'P-0021');
    mockSearchParams.set('noteId', '');

    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/patients/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPatient) });
      }
      if (url.includes('/api/notes/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      return Promise.resolve({ ok: true });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <ClinicalNoteScreen />
    </BrowserRouter>
  );

  it('shows loading state initially', () => {
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('fetches and displays patient info', async () => {
    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/patients/P-0021');
      expect(screen.getByTestId('patient-info-card')).toHaveTextContent('John Doe');
    });
  });

  it('displays all SOAP sections', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('section-S - Subjective')).toBeInTheDocument();
      expect(screen.getByTestId('section-O - Objective')).toBeInTheDocument();
      expect(screen.getByTestId('section-A - Assessment')).toBeInTheDocument();
      expect(screen.getByTestId('section-P - Plan')).toBeInTheDocument();
    });
  });

  it('allows filling subjective section', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('select-cn-chiefComplaint')).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByTestId('select-cn-chiefComplaint'), 'Hypertension');
    await user.type(screen.getByTestId('textarea-cn-subjectiveDescription'), 'Patient reports headache');

    expect(screen.getByTestId('select-cn-chiefComplaint')).toHaveValue('Hypertension');
    expect(screen.getByTestId('textarea-cn-subjectiveDescription')).toHaveValue('Patient reports headache');
  });

  it('shows validation errors when required fields are empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Save & Sync')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Save & Sync'));

    await waitFor(() => {
      expect(screen.getByTestId('error-cn-chiefComplaint')).toBeInTheDocument();
      expect(screen.getByTestId('error-cn-subjectiveDescription')).toBeInTheDocument();
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Please fix the highlighted fields before saving.',
        variant: 'warning',
      });
    });
  });

  it('saves note successfully', async () => {
    const user = userEvent.setup();
    let saveCalled = false;

    global.fetch.mockImplementation((url, options) => {
      if (url.includes('/api/patients/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPatient) });
      }
      if (options?.method === 'POST' && url === '/api/notes') {
        saveCalled = true;
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({ ok: true });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('select-cn-chiefComplaint')).toBeInTheDocument();
    });

    // Fill required fields
    await user.selectOptions(screen.getByTestId('select-cn-chiefComplaint'), 'Hypertension');
    await user.type(screen.getByTestId('textarea-cn-subjectiveDescription'), 'Patient reports headache');
    await user.type(screen.getByTestId('input-cn-bloodPressure'), '120/80');
    await user.type(screen.getByTestId('input-cn-heartRate'), '72');
    await user.type(screen.getByTestId('input-cn-temperature'), '36.7');
    await user.type(screen.getByTestId('input-cn-weight'), '68');
    await user.selectOptions(screen.getByTestId('select-cn-diagnosisCategory'), 'Hypertension');
    await user.type(screen.getByTestId('textarea-cn-clinicalAssessment'), 'Mild hypertension');
    await user.type(screen.getByTestId('textarea-cn-treatmentPlan'), 'Monitor BP');

    await user.click(screen.getByText('Save & Sync'));

    await waitFor(() => {
      expect(saveCalled).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  it('shows unsaved changes modal when navigating back with edits', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('select-cn-chiefComplaint')).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByTestId('select-cn-chiefComplaint'), 'Hypertension');
    await user.click(screen.getByTestId('back-button'));

    await waitFor(() => {
      expect(screen.getByTestId('unsaved-modal')).toBeInTheDocument();
    });
  });
});