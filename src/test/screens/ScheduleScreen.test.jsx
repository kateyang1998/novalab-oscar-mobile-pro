// src/test/screens/ScheduleScreen.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ScheduleScreen from '../../screens/ScheduleScreen';

// Mock dependencies
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  };
});

// Mock child components
vi.mock('../../components/schedule/ViewSwitcher', () => ({
  default: ({ activeView, onChange }) => (
    <div data-testid="view-switcher">
      <button data-testid="day-view" onClick={() => onChange('day')}>Day</button>
      <button data-testid="week-view" onClick={() => onChange('week')}>Week</button>
      <button data-testid="month-view" onClick={() => onChange('month')}>Month</button>
      <span>Active: {activeView}</span>
    </div>
  ),
}));

vi.mock('../../components/schedule/CalendarHeader', () => ({
  default: ({ title, onPrev, onNext }) => (
    <div data-testid="calendar-header">
      <button data-testid="prev-btn" onClick={onPrev}>Prev</button>
      <span>{title}</span>
      <button data-testid="next-btn" onClick={onNext}>Next</button>
    </div>
  ),
}));

vi.mock('../../components/schedule/MonthGrid', () => ({
  default: ({ onSelectDate, onAppointmentPress }) => (
    <div data-testid="month-grid">
      <button data-testid="month-select-date" onClick={() => onSelectDate('2024-03-15')}>Select Date</button>
    </div>
  ),
}));

vi.mock('../../components/schedule/WeekGrid', () => ({
  default: ({ onSelectDate, onAppointmentPress }) => (
    <div data-testid="week-grid">
      <button data-testid="week-select-date" onClick={() => onSelectDate('2024-03-15')}>Select Date</button>
    </div>
  ),
}));

vi.mock('../../components/schedule/DayTimeline', () => ({
  default: ({ onAppointmentPress }) => (
    <div data-testid="day-timeline">
      <button data-testid="appointment-press" onClick={() => onAppointmentPress({ id: 1, patientName: 'John Doe' })}>Appointment</button>
    </div>
  ),
}));

vi.mock('../../components/schedule/Scheduleutils', async () => {
  const actual = await vi.importActual('../../components/schedule/Scheduleutils');
  return {
    ...actual,
    getTodayString: () => '2024-03-20',
    getWeekDates: () => ['2024-03-18', '2024-03-19', '2024-03-20', '2024-03-21', '2024-03-22', '2024-03-23', '2024-03-24'],
  };
});

global.fetch = vi.fn();

describe('ScheduleScreen', () => {
  const mockAppointments = [
    { id: 1, patientName: 'John Doe', date: '2024-03-20', time: '10:00', type: 'Follow-up' },
    { id: 2, patientName: 'Jane Smith', date: '2024-03-20', time: '14:00', type: 'Consultation' },
  ];

  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseLocation.mockReturnValue({ state: null });
    global.fetch.mockClear();
    global.fetch.mockImplementation(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockAppointments) })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <ScheduleScreen />
    </BrowserRouter>
  );

  it('fetches appointments on mount', async () => {
    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/appointments');
    });
  });

  it('displays day view by default', () => {
    renderComponent();
    expect(screen.getByTestId('day-timeline')).toBeInTheDocument();
  });

  it('switches between views', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId('week-view'));
    expect(screen.getByTestId('week-grid')).toBeInTheDocument();

    await user.click(screen.getByTestId('month-view'));
    expect(screen.getByTestId('month-grid')).toBeInTheDocument();

    await user.click(screen.getByTestId('day-view'));
    expect(screen.getByTestId('day-timeline')).toBeInTheDocument();
  });

  it('navigates to edit appointment when clicking an appointment', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('appointment-press')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('appointment-press'));

    expect(mockNavigate).toHaveBeenCalledWith('/appointment/edit', {
      state: { appointment: { id: 1, patientName: 'John Doe' } }
    });
  });

  it('changes date when selecting from month view', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId('month-view'));
    expect(screen.getByTestId('month-grid')).toBeInTheDocument();

    await user.click(screen.getByTestId('month-select-date'));

    // Should switch to day view after selecting date
    expect(screen.getByTestId('day-timeline')).toBeInTheDocument();
  });

  it('navigates through calendar with prev/next buttons', async () => {
    const user = userEvent.setup();
    renderComponent();

    const prevButton = screen.getByTestId('prev-btn');
    const nextButton = screen.getByTestId('next-btn');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    await user.click(nextButton);
    await user.click(prevButton);

    // Just verify buttons work without errors
    expect(screen.getByTestId('day-timeline')).toBeInTheDocument();
  });
});