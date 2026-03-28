// src/test/screens/SettingsScreen.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SettingsScreen from '../../screens/SettingsScreen';

// Mock dependencies
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
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

vi.mock('../../components/settings/SettingSection', () => ({
  default: ({ title, children }) => (
    <div data-testid={`section-${title.toLowerCase().replace(/\s/g, '-')}`}>
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

vi.mock('../../components/settings/SettingRow', () => ({
  default: ({ label, description, showToggle, toggleOn, onToggle, onClick }) => (
    <div data-testid={`setting-${label.toLowerCase().replace(/\s/g, '-')}`}>
      <span>{label}</span>
      <span>{description}</span>
      {showToggle && (
        <button data-testid={`toggle-${label.toLowerCase().replace(/\s/g, '-')}`} onClick={onToggle}>
          {toggleOn ? 'On' : 'Off'}
        </button>
      )}
      {onClick && (
        <button data-testid={`nav-${label.toLowerCase().replace(/\s/g, '-')}`} onClick={onClick}>
          Navigate
        </button>
      )}
    </div>
  ),
}));

global.fetch = vi.fn();

describe('SettingsScreen', () => {
  const mockSettings = {
    biometricLogin: true,
    autoLock: true,
    pushNotifications: false,
    appointmentReminders: true,
    autoSync: true,
    offlineMode: false,
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    global.fetch.mockClear();
    global.fetch.mockImplementation((url, options) => {
      if (url === '/api/settings' && !options) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSettings) });
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
      <SettingsScreen />
    </BrowserRouter>
  );

  it('fetches and displays settings', async () => {
    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/settings');
      expect(screen.getByTestId('setting-biometric-login')).toBeInTheDocument();
      expect(screen.getByTestId('setting-auto-lock')).toBeInTheDocument();
    });
  });

  it('displays all setting sections', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('section-security')).toBeInTheDocument();
      expect(screen.getByTestId('section-notifications')).toBeInTheDocument();
      expect(screen.getByTestId('section-data-&-sync')).toBeInTheDocument();
      expect(screen.getByTestId('section-system')).toBeInTheDocument();
    });
  });

  it('toggles biometric login setting', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('toggle-biometric-login')).toBeInTheDocument();
    });

    const toggle = screen.getByTestId('toggle-biometric-login');
    await user.click(toggle);

    expect(global.fetch).toHaveBeenCalledWith('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ biometricLogin: false }),
    });
  });

  it('toggles push notifications setting', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('toggle-push-notifications')).toBeInTheDocument();
    });

    const toggle = screen.getByTestId('toggle-push-notifications');
    await user.click(toggle);

    expect(global.fetch).toHaveBeenCalledWith('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pushNotifications: true }),
    });
  });

  it('navigates to help & support', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('nav-help-&-support')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('nav-help-&-support'));
    expect(mockNavigate).toHaveBeenCalledWith('/help');
  });

  it('navigates back when back button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('back-button'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});