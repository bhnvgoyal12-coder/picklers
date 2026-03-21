import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { GameCard } from './GameCard';
import type { Game } from '../../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockGame: Game = {
  id: 'game-123',
  title: 'Sunday Morning Pickleball',
  description: 'Casual game for all levels',
  date: '2025-06-15',
  start_time: '09:00',
  end_time: '11:00',
  location_name: 'Koramangala Sports Complex',
  location_address: '123 Main St',
  location_map_url: 'https://maps.google.com',
  court_info: 'Court 1',
  max_players: 8,
  price_per_player: 20000, // ₹200
  currency: 'INR',
  status: 'upcoming',
  created_by: 'user-1',
  created_at: '2025-06-01T00:00:00Z',
  updated_at: '2025-06-01T00:00:00Z',
  spots_taken: 3,
};

function renderGameCard(game: Game = mockGame) {
  return render(
    <MemoryRouter>
      <GameCard game={game} />
    </MemoryRouter>
  );
}

describe('GameCard', () => {
  it('renders game title', () => {
    renderGameCard();
    expect(screen.getByText('Sunday Morning Pickleball')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    renderGameCard();
    expect(screen.getByText(/15/)).toBeInTheDocument();
    expect(screen.getByText(/Jun/)).toBeInTheDocument();
  });

  it('renders formatted time range', () => {
    renderGameCard();
    expect(screen.getByText(/9:00 AM/)).toBeInTheDocument();
    expect(screen.getByText(/11:00 AM/)).toBeInTheDocument();
  });

  it('renders location name', () => {
    renderGameCard();
    expect(screen.getByText('Koramangala Sports Complex')).toBeInTheDocument();
  });

  it('renders price when price > 0', () => {
    renderGameCard();
    expect(screen.getByText('₹200')).toBeInTheDocument();
  });

  it('does not render price when price is 0', () => {
    renderGameCard({ ...mockGame, price_per_player: 0 });
    expect(screen.queryByText(/₹/)).not.toBeInTheDocument();
  });

  it('renders SpotsBadge with correct spots', () => {
    renderGameCard();
    expect(screen.getByText('5 spots left')).toBeInTheDocument();
  });

  it('navigates to game detail on click', async () => {
    const user = userEvent.setup();
    renderGameCard();
    const button = screen.getByRole('button');
    await user.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/games/game-123');
  });

  it('renders SpotsBadge as Full when game is full', () => {
    renderGameCard({ ...mockGame, spots_taken: 8 });
    expect(screen.getByText('Full')).toBeInTheDocument();
  });

  it('defaults spots_taken to 0 when undefined', () => {
    const gameWithoutSpots = { ...mockGame, spots_taken: undefined };
    renderGameCard(gameWithoutSpots);
    expect(screen.getByText('8 spots left')).toBeInTheDocument();
  });
});
