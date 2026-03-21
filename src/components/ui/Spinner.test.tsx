import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders a spinner element', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Spinner className="py-20" />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass('py-20');
  });

  it('has flex centering classes', () => {
    const { container } = render(<Spinner />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
