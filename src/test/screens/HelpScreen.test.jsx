// src/test/screens/HelpScreen.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import HelpScreen from '../../screens/HelpScreen';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Fix the TopHeader mock path - adjust based on your actual path
vi.mock('../../components/layout/TopHeader', () => ({
  default: ({ title, onBack }) => (
    <div data-testid="top-header">
      <button data-testid="back-button" onClick={onBack}>Back</button>
      <span>{title}</span>
    </div>
  ),
}));

const mockNavigate = vi.fn();

describe('HelpScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <HelpScreen />
    </BrowserRouter>
  );

  it('renders help screen with title and intro text', () => {
    renderComponent();

    expect(screen.getByText('Help & Support')).toBeInTheDocument();
    expect(screen.getByText(/If you need assistance/)).toBeInTheDocument();
  });

  it('displays all contact cards', () => {
    renderComponent();

    expect(screen.getByText('OSCAR Support')).toBeInTheDocument();
    expect(screen.getByText('Clinical Help Desk')).toBeInTheDocument();
    expect(screen.getByText('Account Manager')).toBeInTheDocument();
  });

  it('displays correct contact information for each card', () => {
    renderComponent();

    // OSCAR Support
    expect(screen.getByText('+1 (555) 210-0123')).toBeInTheDocument();
    expect(screen.getByText('support@oscar.example.com')).toBeInTheDocument();
    expect(screen.getByText('Mon–Fri 08:00–18:00')).toBeInTheDocument();

    // Clinical Help Desk
    expect(screen.getByText('+1 (555) 210-0456')).toBeInTheDocument();
    expect(screen.getByText('clinichelp@oscar.example.com')).toBeInTheDocument();
    expect(screen.getByText('Mon–Fri 09:00–17:00')).toBeInTheDocument();
  });

  it('displays avatar initials for each contact', () => {
    renderComponent();

    expect(screen.getByText('OS')).toBeInTheDocument();
    expect(screen.getByText('CH')).toBeInTheDocument();
    expect(screen.getByText('AM')).toBeInTheDocument();
  });

  it('renders phone and email as clickable links', () => {
    renderComponent();

    const phoneLink = screen.getByText('+1 (555) 210-0123').closest('a');
    expect(phoneLink).toHaveAttribute('href', 'tel:+15552100123');

    const emailLink = screen.getByText('support@oscar.example.com').closest('a');
    expect(emailLink).toHaveAttribute('href', 'mailto:support@oscar.example.com');
  });

  it('navigates back when back button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Try to find back button by text instead of test-id if test-id is not working
    const backButton = screen.getByText('Back');
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});