import { Badge } from '../ui/Badge';

interface SpotsBadgeProps {
  spotsTaken: number;
  maxPlayers: number;
}

export function SpotsBadge({ spotsTaken, maxPlayers }: SpotsBadgeProps) {
  const spotsLeft = maxPlayers - spotsTaken;
  const variant = spotsLeft === 0 ? 'danger' : spotsLeft <= 2 ? 'warning' : 'success';

  return (
    <Badge variant={variant}>
      {spotsLeft === 0 ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
    </Badge>
  );
}
