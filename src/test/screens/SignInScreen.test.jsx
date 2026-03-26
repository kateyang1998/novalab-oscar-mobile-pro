// src/test/screens/SignInScreen.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignInScreen from '../../screens/SignInScreen';

// Mock dependencies
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock TextInput component
vi.mock('../../components/common/TextInput', () => ({
  default: ({ label, value, onChange, placeholder, error, type, id }) => {
    const isForgotModal = id === 'forgot-userid';
    const testId = isForgotModal ? 'forgot-user-id' : `input-${label.toLowerCase().replace(/\s/g, '-')}`;

    return (
      <div>
        <label>{label}</label>
        <input
          data-testid={testId}
          type={type || 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {error && <div data-testid={`error-${label.toLowerCase().replace(/\s/g, '-')}`} style={{ color: 'red' }}>{error}</div>}
      </div>
    );
  },
}));

global.fetch = vi.fn();

describe('SignInScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    global.fetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <SignInScreen />
    </BrowserRouter>
  );

  it('renders sign in form', () => {
    renderComponent();

    expect(screen.getByText('OSCAR Mobile Pro')).toBeInTheDocument();
    expect(screen.getByTestId('input-user-id')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByText('SIGN IN')).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('SIGN IN'));

    // Check for error messages by text content instead of test-id
    await waitFor(() => {
      expect(screen.getByText('Please enter your User ID.')).toBeInTheDocument();
      expect(screen.getByText('Please enter your Password.')).toBeInTheDocument();
    });
  });

  it('successfully signs in with valid credentials', async () => {
    const user = userEvent.setup();
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'abc123' }) })
    );

    renderComponent();

    await user.type(screen.getByTestId('input-user-id'), 'CL000001');
    await user.type(screen.getByTestId('input-password'), 'oscar123');
    await user.click(screen.getByText('SIGN IN'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'CL000001', password: 'oscar123' }),
      });
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('shows error message when login fails', async () => {
    const user = userEvent.setup();
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'Invalid user id or password.' }) })
    );

    renderComponent();

    await user.type(screen.getByTestId('input-user-id'), 'CL000001');
    await user.type(screen.getByTestId('input-password'), 'wrongpass');
    await user.click(screen.getByText('SIGN IN'));

    await waitFor(() => {
      expect(screen.getByText('Invalid user id or password.')).toBeInTheDocument();
    });
  });

  it('shows error message when network fails', async () => {
    const user = userEvent.setup();
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    renderComponent();

    await user.type(screen.getByTestId('input-user-id'), 'CL000001');
    await user.type(screen.getByTestId('input-password'), 'oscar123');
    await user.click(screen.getByText('SIGN IN'));

    await waitFor(() => {
      expect(screen.getByText('Could not connect to server. Please try again.')).toBeInTheDocument();
    });
  });

  it('opens forgot password modal', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('Forgot Password?'));

    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByTestId('forgot-user-id')).toBeInTheDocument();
  });

  it('resets password successfully', async () => {
    const user = userEvent.setup();
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );

    renderComponent();

    await user.click(screen.getByText('Forgot Password?'));
    await user.type(screen.getByTestId('forgot-user-id'), 'CL000001');
    await user.click(screen.getByText('Reset'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'CL000001' }),
      });
      expect(screen.getByText('Your password has been reset to: oscar123')).toBeInTheDocument();
    });
  });

  it('shows error when forgot password user ID not found', async () => {
    const user = userEvent.setup();
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'User ID not found.' }) })
    );

    renderComponent();

    await user.click(screen.getByText('Forgot Password?'));
    await user.type(screen.getByTestId('forgot-user-id'), 'INVALID');
    await user.click(screen.getByText('Reset'));

    await waitFor(() => {
      expect(screen.getByText('User ID not found.')).toBeInTheDocument();
    });
  });
});