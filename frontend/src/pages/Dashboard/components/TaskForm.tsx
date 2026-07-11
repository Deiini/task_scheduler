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
  Box,
  Typography,
  Alert,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Task, TaskFormData } from '../../types/taskTypes';
import { Agent } from '../../types/agentTypes';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  task?: Task | null;
  agents: Agent[];
}

const SCHEDULE_TYPES = [
  { value: 'cron', label: 'Expression Cron' },
  { value: 'interval', label: 'Intervalle (secondes)' },
  { value: 'once', label: 'Une seule fois' },
];

const CRON_HELP = `Format: minute heure jour mois jour_semaine
Exemples:
  - "0 0 * * *"     = tous les jours à minuit
  - "*/15 * * * *"  = toutes les 15 minutes
  - "0 9 * * 1-5"  = 9h du matin, jours ouvrables`;

export const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, onSubmit, task, agents }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    schedule: '',
    schedule_type: 'cron',
    agent_id: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description || '',
        schedule: task.schedule,
        schedule_type: task.schedule_type,
        agent_id: task.agent_id,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        schedule: '',
        schedule_type: 'cron',
        agent_id: null,
      });
    }
    setErrors({});
    setError(null);
  }, [task, open]);

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!formData.schedule.trim()) {
      newErrors.schedule = "L'horodatage est requis";
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

  const onlineAgents = agents.filter((a) => a.status === 'online');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Modifier une Tâche' : 'Ajouter une Tâche'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nom de la tâche"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Type de planification</InputLabel>
            <Select
              value={formData.schedule_type}
              onChange={(e) => handleChange('schedule_type', e.target.value)}
              label="Type de planification"
            >
              {SCHEDULE_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <TextField
              label={
                formData.schedule_type === 'interval'
                  ? 'Intervalle (en secondes)'
                  : 'Expression'
              }
              value={formData.schedule}
              onChange={(e) => handleChange('schedule', e.target.value)}
              error={!!errors.schedule}
              helperText={errors.schedule || (formData.schedule_type === 'cron' ? 'Ex: 0 0 * * *' : '')}
              fullWidth
              required
            />
            {formData.schedule_type === 'cron' && (
              <Tooltip title={CRON_HELP} placement="right-end">
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, color: 'text.secondary' }}>
                  <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="caption">Cliquez sur l'icône pour plus d'aide</Typography>
                </Box>
              </Tooltip>
            )}
          </Box>
          <FormControl fullWidth>
            <InputLabel>Agent responsable</InputLabel>
            <Select
              value={formData.agent_id || ''}
              onChange={(e) => handleChange('agent_id', e.target.value || '')}
              label="Agent responsable"
            >
              <MenuItem value="">
                <em>Automatique (tout agent)</em>
              </MenuItem>
              {onlineAgents.length === 0 ? (
                <MenuItem value="" disabled>
                  Aucun agent en ligne disponible
                </MenuItem>
              ) : (
                onlineAgents.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.hostname})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : task ? 'Modifier' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
