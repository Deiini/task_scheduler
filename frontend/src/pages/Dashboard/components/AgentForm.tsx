import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Agent, AgentFormData } from '../../types/agentTypes';

interface AgentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AgentFormData) => Promise<void>;
  agent?: Agent | null;
}

const AVAILABLE_CAPABILITIES = [
  'Web Scraping',
  'Data Processing',
  'File Transfer',
  'API Integration',
  'Database Operations',
  'Email Notifications',
  'Report Generation',
  'System Monitoring',
];

export const AgentForm: React.FC<AgentFormProps> = ({ open, onClose, onSubmit, agent }) => {
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    hostname: '',
    ip_address: '',
    capabilities: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        hostname: agent.hostname,
        ip_address: agent.ip_address,
        capabilities: agent.capabilities || [],
      });
    } else {
      setFormData({
        name: '',
        hostname: '',
        ip_address: '',
        capabilities: [],
      });
    }
    setErrors({});
    setError(null);
  }, [agent, open]);

  const handleChange = (field: keyof AgentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCapabilityChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setFormData((prev) => ({ ...prev, capabilities: value }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!formData.hostname.trim()) {
      newErrors.hostname = "Le hostname est requis";
    }
    if (!formData.ip_address.trim()) {
      newErrors.ip_address = "L'adresse IP est requise";
    } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.ip_address)) {
      newErrors.ip_address = "Format d'adresse IP invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{agent ? 'Modifier un Agent' : 'Ajouter un Agent'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nom"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />
          <TextField
            label="Hostname"
            value={formData.hostname}
            onChange={(e) => handleChange('hostname', e.target.value)}
            error={!!errors.hostname}
            helperText={errors.hostname}
            fullWidth
            required
          />
          <TextField
            label="Adresse IP"
            value={formData.ip_address}
            onChange={(e) => handleChange('ip_address', e.target.value)}
            error={!!errors.ip_address}
            helperText={errors.ip_address}
            fullWidth
            required
            placeholder="192.168.1.1"
          />
          <FormControl fullWidth>
            <InputLabel>Capacités</InputLabel>
            <Select
              multiple
              value={formData.capabilities}
              onChange={handleCapabilityChange}
              label="Capacités"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {AVAILABLE_CAPABILITIES.map((cap) => (
                <MenuItem key={cap} value={cap}>
                  {cap}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : agent ? 'Modifier' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
