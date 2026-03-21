import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpotsBadge } from './SpotsBadge';

describe('SpotsBadge', () => {
  it('shows spots left when spots are available', () => {
    render(<SpotsBadge spotsTaken={3} maxPlayers={8} />);
    expect(screen.getByText('5 spots left')).toBeInTheDocument();
  });

  it('shows singular "spot" when exactly 1 spot left', () => {
    render(<SpotsBadge spotsTaken={7} maxPlayers={8} />);
    expect(screen.getByText('1 spot left')).toBeInTheDocument();
  });

  it('shows "Full" when no spots left', () => {
    render(<SpotsBadge spotsTaken={8} maxPlayers={8} />);
    expect(screen.getByText('Full')).toBeInTheDocument();
  });

  it('uses danger variant when full', () => {
    render(<SpotsBadge spotsTaken={8} maxPlayers={8} />);
    const badge = screen.getByText('Full');
    expect(badge).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('uses warning variant when 2 or fewer spots left', () => {
    render(<SpotsBadge spotsTaken={6} maxPlayers={8} />);
    const badge = screen.getByText('2 spots left');
    expect(badge).toHaveClass('bg-amber-100', 'text-amber-700');
  });

  it('uses warning variant when exactly 1 spot left', () => {
    render(<SpotsBadge spotsTaken={7} maxPlayers={8} />);
    const badge = screen.getByText('1 spot left');
    expect(badge).toHaveClass('bg-amber-100', 'text-amber-700');
  });

  it('uses success variant when more than 2 spots left', () => {
    render(<SpotsBadge spotsTaken={2} maxPlayers={8} />);
    const badge = screen.getByText('6 spots left');
    expect(badge).toHaveClass('bg-emerald-100', 'text-emerald-700');
  });
});
