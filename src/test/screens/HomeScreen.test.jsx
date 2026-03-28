// src/test/screens/HomeScreen.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import HomeScreen from '../../screens/HomeScreen';

// Mock dependencies
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock all child components
vi.mock('../../components/common/SearchBar', () => ({
  default: ({ value, onChange, onSubmit }) => (
    <div data-testid="search-bar">
      <input
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit(value)}
      />
      <button data-testid="search-submit" onClick={() => onSubmit(value)}>Search</button>
    </div>
  ),
}));

vi.mock('../../components/home/ScheduleToday', () => ({
  default: ({ items }) => (
    <div data-testid="schedule-today">
      {items?.length ? `${items.length} appointments` : 'No appointments'}
    </div>
  ),
}));

vi.mock('../../components/home/RecentPatients', () => ({
  default: ({ patients }) => (
    <div data-testid="recent-patients">
      {patients?.length ? `${patients.length} recent patients` : 'No recent patients'}
    </div>
  ),
}));

vi.mock('../../components/patient/PatientGrid', () => ({
  default: ({ patients, onPatientClick }) => (
    <div data-testid="patient-grid">
      {patients?.map(p => (
        <button key={p.id} data-testid={`patient-${p.id}`} onClick={() => onPatientClick(p.id)}>
          {p.name}
        </button>
      ))}
    </div>
  ),
}));

// Mock Icons component
vi.mock('../../components/common/Icons', () => ({
  IconUser: ({ size, color, onClick }) => (
    <div data-testid="profile-icon" onClick={onClick} style={{ cursor: 'pointer' }}>
      User Icon
    </div>
  ),
}));

global.fetch = vi.fn();

describe('HomeScreen', () => {
  const mockAppointments = [
    { id: 1, patientName: 'John Doe', time: '09:00', type: 'Follow-up', status: 'Scheduled' },
    { id: 2, patientName: 'Jane Smith', time: '10:30', type: 'Consultation', status: 'Confirmed' },
  ];

  const mockPatients = [
    { id: 'p1', name: 'John Doe', lastVisitDate: '2024-03-20' },
    { id: 'p2', name: 'Jane Smith', lastVisitDate: '2024-03-19' },
    { id: 'p3', name: 'Bob Johnson', lastVisitDate: '2024-03-18' },
    { id: 'p4', name: 'Alice Brown', lastVisitDate: '2024-03-15' },
  ];

  const mockClinician = { name: 'Dr. Smith' };

  beforeEach(() => {
    mockNavigate.mockClear();
    global.fetch.mockClear();

    // Mock API responses
    global.fetch.mockImplementation((url) => {
      if (url === '/api/appointments/today') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAppointments) });
      }
      if (url === '/api/patients') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPatients) });
      }
      if (url === '/api/clinician') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockClinician) });
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
      <HomeScreen />
    </BrowserRouter>
  );

  it('renders welcome message with clinician name', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Welcome, Dr. Smith/)).toBeInTheDocument();
    });
  });

  it('fetches and displays today\'s schedule', async () => {
    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/appointments/today');
      expect(screen.getByTestId('schedule-today')).toBeInTheDocument();
    });
  });

  it('fetches and displays recent patients', async () => {
    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/patients');
      expect(screen.getByTestId('recent-patients')).toBeInTheDocument();
    });
  });

  it('shows search bar and allows searching patients', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'John');

    await waitFor(() => {
      expect(screen.getByTestId('patient-grid')).toBeInTheDocument();
      expect(screen.getByTestId('patient-p1')).toHaveTextContent('John Doe');
    });
  });

  it('shows "no patients found" when search returns no results', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'Nonexistent Patient');

    await waitFor(() => {
      expect(screen.getByText('No patients found')).toBeInTheDocument();
    });
  });

  it('navigates to patients screen with search query on submit', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'John');
    await user.click(screen.getByTestId('search-submit'));

    expect(mockNavigate).toHaveBeenCalledWith('/patients', { state: { searchQuery: 'John' } });
  });

  it('navigates to patient summary when clicking a search result', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'John');

    await waitFor(() => {
      expect(screen.getByTestId('patient-p1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('patient-p1'));

    expect(mockNavigate).toHaveBeenCalledWith('/patient/p1/summary');
  });

  it('navigates to profile when clicking profile icon', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
    });

    const profileIcon = screen.getByTestId('profile-icon');
    await user.click(profileIcon);

    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('navigates to schedule with day view when clicking "View All"', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('View All')).toBeInTheDocument();
    });

    await user.click(screen.getByText('View All'));

    const todayStr = new Date().toISOString().slice(0, 10);
    expect(mockNavigate).toHaveBeenCalledWith('/schedule', { state: { view: 'day', date: todayStr } });
  });
});