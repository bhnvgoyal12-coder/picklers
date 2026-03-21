import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

const mockSignInWithGoogle = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    session: null,
    user: null,
    profile: null,
    loading: false,
    signInWithGoogle: mockSignInWithGoogle,
    signOut: vi.fn(),
    refreshProfile: vi.fn(),
  }),
}));

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  it('renders app name "Picklers"', () => {
    renderLoginPage();
    expect(screen.getByText('Picklers')).toBeInTheDocument();
  });

  it('renders Google sign-in button', () => {
    renderLoginPage();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('shows sign-in helper text', () => {
    renderLoginPage();
    expect(screen.getByText('Sign in to join games and host your own')).toBeInTheDocument();
  });

  it('shows tagline text', () => {
    renderLoginPage();
    expect(screen.getByText('Find & join pickleball games')).toBeInTheDocument();
  });

  it('calls signInWithGoogle when button is clicked', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    const button = screen.getByText('Continue with Google');
    await user.click(button);
    expect(mockSignInWithGoogle).toHaveBeenCalled();
  });
});
