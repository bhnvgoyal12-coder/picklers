import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaymentStatusBadge } from './PaymentStatusBadge';

describe('PaymentStatusBadge', () => {
  it('renders "Paid" for paid status with success variant', () => {
    render(<PaymentStatusBadge status="paid" />);
    const badge = screen.getByText('Paid');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-emerald-100', 'text-emerald-700');
  });

  it('renders "Pending" for pending status with warning variant', () => {
    render(<PaymentStatusBadge status="pending" />);
    const badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-amber-100', 'text-amber-700');
  });

  it('renders "Failed" for failed status with danger variant', () => {
    render(<PaymentStatusBadge status="failed" />);
    const badge = screen.getByText('Failed');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('renders "Refunded" for refunded status with info variant', () => {
    render(<PaymentStatusBadge status="refunded" />);
    const badge = screen.getByText('Refunded');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-700');
  });
});
