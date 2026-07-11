import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusChipProps {
  status: 'online' | 'offline' | 'busy' | 'pending' | 'running' | 'completed' | 'failed' | 'disabled';
}

const getStatusConfig = (status: StatusChipProps['status']): { color: ChipProps['color']; label: string } => {
  const configs: Record<StatusChipProps['status'], { color: ChipProps['color']; label: string }> = {
    online: { color: 'success', label: 'En ligne' },
    offline: { color: 'default', label: 'Hors ligne' },
    busy: { color: 'warning', label: 'Occupé' },
    pending: { color: 'info', label: 'En attente' },
    running: { color: 'primary', label: 'En cours' },
    completed: { color: 'success', label: 'Terminé' },
    failed: { color: 'error', label: 'Échoué' },
    disabled: { color: 'default', label: 'Désactivé' },
  };
  return configs[status];
};

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const config = getStatusConfig(status);
  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
      sx={{ minWidth: 90 }}
    />
  );
};
