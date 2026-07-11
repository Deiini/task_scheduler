import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
      }}
    >
      {icon || <AddCircleOutlineIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />}
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction} startIcon={<AddCircleOutlineIcon />}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
