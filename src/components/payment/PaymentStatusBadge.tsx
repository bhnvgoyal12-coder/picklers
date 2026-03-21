import { Badge } from '../ui/Badge';
import type { Registration } from '../../types';

const statusConfig = {
  paid: { variant: 'success' as const, label: 'Paid' },
  pending: { variant: 'warning' as const, label: 'Pending' },
  failed: { variant: 'danger' as const, label: 'Failed' },
  refunded: { variant: 'info' as const, label: 'Refunded' },
};

interface PaymentStatusBadgeProps {
  status: Registration['payment_status'];
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
