import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../components/common/Modal';

describe('Modal', () => {
  it('renders children and calls onDismiss when overlay is clicked but not when container clicked', () => {
    const onDismiss = vi.fn();

    const { container } = render(
      <Modal onDismiss={onDismiss}>
        <div data-testid="child">hello</div>
      </Modal>
    );

    // child rendered
    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();

    // container.firstChild is the overlay element created by Modal
    const overlay = container.firstChild;
    // inner container is overlay's firstElementChild
    const inner = overlay.firstElementChild;

    // clicking inside inner container should NOT call onDismiss
    fireEvent.click(inner);
    expect(onDismiss).not.toHaveBeenCalled();

    // clicking overlay should call onDismiss
    fireEvent.click(overlay);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});



