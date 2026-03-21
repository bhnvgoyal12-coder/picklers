import { Badge } from '../ui/Badge';
import type { Registration } from '../../types';

const statusVariant = {
  paid: 'success',
  pending: 'warning',
  failed: 'danger',
  refunded: 'info',
} as const;

interface PlayerListProps {
  registrations: Registration[];
}

export function PlayerList({ registrations }: PlayerListProps) {
  if (registrations.length === 0) {
    return <p className="text-sm text-gray-500 py-4 text-center">No players registered yet</p>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {registrations.map((reg) => (
        <div key={reg.id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">{reg.player_name}</p>
            <p className="text-xs text-gray-500">{reg.player_phone}</p>
          </div>
          <Badge variant={statusVariant[reg.payment_status]}>
            {reg.payment_status}
          </Badge>
        </div>
      ))}
    </div>
  );
}
