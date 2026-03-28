import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock IconChevronLeft so we don't depend on svg implementation
vi.mock('../../components/common/Icons', () => ({ IconChevronLeft: ({ size, color }) => <svg data-testid="chev" /> }));

import TopHeader from '../../components/layout/TopHeader';

describe('TopHeader', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders title and back button', () => {
    render(<TopHeader title="My Page" onBack={() => {}} />);
    expect(screen.getByText('My Page')).toBeInTheDocument();
    expect(screen.getByLabelText('Back')).toBeInTheDocument();
  });

  it('calls onBack when provided', () => {
    const onBack = vi.fn();
    render(<TopHeader title="X" onBack={onBack} />);
    fireEvent.click(screen.getByLabelText('Back'));
    expect(onBack).toHaveBeenCalled();
  });

  it('navigates back when history length > 1 and no onBack provided', () => {
    // simulate history length
    const oldHistory = window.history.length;
    Object.defineProperty(window, 'history', { value: { length: 2 }, configurable: true });
    render(<TopHeader title="X" />);
    fireEvent.click(screen.getByLabelText('Back'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    // restore (best-effort)
    Object.defineProperty(window, 'history', { value: { length: oldHistory }, configurable: true });
  });

  it('navigates to /home when history length <= 1', () => {
    const oldHistory = window.history.length;
    Object.defineProperty(window, 'history', { value: { length: 1 }, configurable: true });
    render(<TopHeader title="X" />);
    fireEvent.click(screen.getByLabelText('Back'));
    expect(mockNavigate).toHaveBeenCalledWith('/home');
    Object.defineProperty(window, 'history', { value: { length: oldHistory }, configurable: true });
  });
});

