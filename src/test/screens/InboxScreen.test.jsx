// src/test/screens/InboxScreen.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import InboxScreen from '../../screens/InboxScreen';

// Mock dependencies
vi.mock('../components/layout/TopHeader', () => ({
  default: ({ title, right }) => (
    <div data-testid="top-header">
      <span>{title}</span>
      {right}
    </div>
  ),
}));

global.fetch = vi.fn();

describe('InboxScreen', () => {
  const mockMessages = [
    { id: 1, sender: 'Dr. Smith', subject: 'Follow-up', preview: 'Please schedule...', fullContent: 'Please schedule a follow-up appointment.', time: '10:30 AM', isRead: false },
    { id: 2, sender: 'Lab Results', subject: 'Test Results', preview: 'Your results are ready...', fullContent: 'Your test results are ready for review.', time: 'Yesterday', isRead: true },
  ];

  beforeEach(() => {
    global.fetch.mockClear();
    global.fetch.mockImplementation((url, options) => {
      if (url === '/api/messages') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockMessages) });
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
      <InboxScreen />
    </BrowserRouter>
  );

  it('shows loading state initially', () => {
    renderComponent();
    expect(screen.getByText('Loading messages...')).toBeInTheDocument();
  });

  it('fetches and displays messages', async () => {
    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/messages');
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
      expect(screen.getByText('Lab Results')).toBeInTheDocument();
    });
  });

  it('expands message when clicked to show full content', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    // Initially shows preview only
    expect(screen.getByText('Please schedule...')).toBeInTheDocument();
    expect(screen.queryByText('Please schedule a follow-up appointment.')).not.toBeInTheDocument();

    // Click to expand
    await user.click(screen.getByText('Dr. Smith'));

    // Now shows full content
    await waitFor(() => {
      expect(screen.getByText('Please schedule a follow-up appointment.')).toBeInTheDocument();
    });
  });

  it('marks message as read when expanded', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Dr. Smith'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/messages/1/read', { method: 'PATCH' });
    });
  });

  it('shows "No messages" when inbox is empty', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No messages')).toBeInTheDocument();
    });
  });

  it('marks all messages as read when clicking button', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Mark all read')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Mark all read'));

    expect(global.fetch).toHaveBeenCalledWith('/api/messages/read-all', { method: 'PATCH' });
  });
});