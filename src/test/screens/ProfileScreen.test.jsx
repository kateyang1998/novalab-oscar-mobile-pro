// src/test/screens/ProfileScreen.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ProfileScreen from '../../screens/ProfileScreen';

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
vi.mock('../../components/layout/TopHeader', () => ({
  default: ({ title, onBack }) => (
    <div>
      <button data-testid="back-button" onClick={onBack}>Back</button>
      <span>{title}</span>
    </div>
  ),
}));

vi.mock('../../components/profile/UserProfileCard', () => ({
  default: ({ name }) => <div data-testid="user-profile-card">{name || 'Loading...'}</div>,
}));

vi.mock('../../components/profile/SecuritySection', () => ({
  default: ({ onChangePassword }) => (
    <div>
      <button data-testid="change-password-btn" onClick={onChangePassword}>Change Password</button>
    </div>
  ),
}));

vi.mock('../../components/profile/SystemSection', () => ({
  default: ({ onSettings, onSyncStatus }) => (
    <div>
      <button data-testid="settings-btn" onClick={onSettings}>Settings</button>
      <button data-testid="sync-status-btn" onClick={onSyncStatus}>Sync Status</button>
    </div>
  ),
}));

vi.mock('../../components/profile/LogoutButton', () => ({
  default: ({ onLogout }) => (
    <button data-testid="logout-btn" onClick={onLogout}>Logout</button>
  ),
}));

vi.mock('../../components/profile/LogoutConfirmModal', () => ({
  default: ({ onConfirm, onDismiss }) => (
    <div data-testid="logout-modal">
      <button data-testid="confirm-logout" onClick={onConfirm}>Confirm</button>
      <button data-testid="cancel-logout" onClick={onDismiss}>Cancel</button>
    </div>
  ),
}));

vi.mock('../../components/profile/ChangePasswordModal', () => ({
  default: ({ onSubmit, onDismiss }) => (
    <div data-testid="change-password-modal">
      {/* submit a strong-enough password to bypass client-side validation */}
      <button data-testid="submit-password" onClick={() => onSubmit({ current: 'old', next: 'newpassword', confirm: 'newpassword' })}>Submit</button>
      <button data-testid="cancel-password" onClick={onDismiss}>Cancel</button>
    </div>
  ),
}));

vi.mock('../../components/profile/SyncStatusModal', () => ({
  default: ({ onClose, onSync }) => (
    <div data-testid="sync-modal">
      <button data-testid="sync-now" onClick={onSync}>Sync Now</button>
      <button data-testid="close-sync" onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('../../components/common/toastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

const mockShowToast = vi.fn();
global.fetch = vi.fn();

describe('ProfileScreen', () => {
  const mockClinician = {
    name: 'Dr. Smith',
    role: 'Cardiologist',
    email: 'dr.smith@example.com',
    clinicianId: 1234,
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockShowToast.mockClear();
    global.fetch.mockClear();
    global.fetch.mockImplementation(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockClinician) })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <ProfileScreen />
    </BrowserRouter>
  );

  it('fetches and displays clinician profile', async () => {
    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/clinician');
      expect(screen.getByTestId('user-profile-card')).toHaveTextContent('Dr. Smith');
    });
  });

  it('navigates back when back button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Back'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('opens logout confirmation modal', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('logout-btn'));
    expect(screen.getByTestId('logout-modal')).toBeInTheDocument();
  });

  it('confirms logout and navigates to sign in', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('logout-btn'));
    await user.click(screen.getByTestId('confirm-logout'));

    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  it('opens change password modal', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('change-password-btn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('change-password-btn'));
    expect(screen.getByTestId('change-password-modal')).toBeInTheDocument();
  });

  it('submits change password successfully and shows toast', async () => {
    const user = userEvent.setup();
    // mock clinician fetch and successful password change
    global.fetch.mockImplementation((url, opts) => {
      if (url === '/api/clinician') return Promise.resolve({ ok: true, json: () => Promise.resolve(mockClinician) });
      if (url === '/api/clinician/password') return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    renderComponent();

    await user.click(screen.getByTestId('change-password-btn'));
    await user.click(screen.getByTestId('submit-password'));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(expect.objectContaining({ message: 'Password changed successfully!', variant: 'success' }));
    });
  });

  it('shows server error for incorrect current password and keeps modal open', async () => {
    const user = userEvent.setup();
    // mock clinician fetch and server error for password change
    global.fetch.mockImplementation((url, opts) => {
      if (url === '/api/clinician') return Promise.resolve({ ok: true, json: () => Promise.resolve(mockClinician) });
      if (url === '/api/clinician/password') return Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'Current password incorrect' }) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    renderComponent();

    await user.click(screen.getByTestId('change-password-btn'));
    await user.click(screen.getByTestId('submit-password'));

    await waitFor(() => {
      // toast should be called with error
      expect(mockShowToast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'error' }));
      // modal remains present (since ProfileScreen keeps it open when server error mentions current)
      expect(screen.getByTestId('change-password-modal')).toBeInTheDocument();
    });
  });

  it('shows network error toast when change password fetch fails', async () => {
    const user = userEvent.setup();
    // mock clinician fetch and then network failure when calling password endpoint
    global.fetch.mockImplementation((url, opts) => {
      if (url === '/api/clinician') return Promise.resolve({ ok: true, json: () => Promise.resolve(mockClinician) });
      if (url === '/api/clinician/password') return Promise.reject(new Error('network'));
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    renderComponent();

    await user.click(screen.getByTestId('change-password-btn'));
    await user.click(screen.getByTestId('submit-password'));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'error' }));
    });
  });

  it('navigates to settings', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('settings-btn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('settings-btn'));
    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });

  it('opens sync status modal', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('sync-status-btn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('sync-status-btn'));
    expect(screen.getByTestId('sync-modal')).toBeInTheDocument();
  });
});