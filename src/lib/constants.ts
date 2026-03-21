export const ROUTES = {
  HOME: '/',
  GAME_DETAIL: '/games/:id',
  MY_GAMES: '/my-games',
  ADMIN: '/admin',
  ADMIN_GAMES: '/admin/games',
  ADMIN_GAME_DETAIL: '/admin/games/:id',
  CREATE_GAME: '/admin/games/new',
} as const;

export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, '0')} ${ampm}`;
}
