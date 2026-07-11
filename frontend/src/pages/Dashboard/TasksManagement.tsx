import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Tooltip,
  Alert,
  Grid,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Task } from '../../types/taskTypes';
import { Agent } from '../../types/agentTypes';
import { StatusChip } from './components/StatusChip';
import { SearchFilter } from './components/SearchFilter';
import { TaskForm } from './components/TaskForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { EmptyState } from './components/EmptyState';
import { LoadingOverlay } from './components/LoadingOverlay';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const TasksManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; task: Task | null }>({
    open: false,
    task: null,
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulation des données (à remplacer par des appels API)
      const mockAgents: Agent[] = [
        { id: '1', name: 'Agent Principal', hostname: 'srv-web-01', ip_address: '192.168.1.10', status: 'online', capabilities: [], last_heartbeat: new Date().toISOString(), tasks_count: 5, cpu_usage: 45, memory_usage: 62, created_at: '', updated_at: '' },
        { id: '2', name: 'Agent Secondary', hostname: 'srv-data-02', ip_address: '192.168.1.11', status: 'busy', capabilities: [], last_heartbeat: new Date().toISOString(), tasks_count: 8, cpu_usage: 89, memory_usage: 78, created_at: '', updated_at: '' },
      ];
      
      const mockTasks: Task[] = [
        {
          id: '1',
          name: 'Backup Database',
          description: 'Sauvegarde quotidienne de la base de données principale',
          schedule: '0 2 * * *',
          schedule_type: 'cron',
          agent_id: '1',
          agent_name: 'Agent Principal',
          status: 'pending',
          last_run: new Date(Date.now() - 86400000).toISOString(),
          next_run: new Date(Date.now() + 86400000).toISOString(),
          run_count: 156,
          created_at: '2024-01-10T08:00:00Z',
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Sync Files',
          description: 'Synchronisation des fichiers avec le serveur de backup',
          schedule: '*/30 * * * *',
          schedule_type: 'cron',
          agent_id: '2',
          agent_name: 'Agent Secondary',
          status: 'running',
          last_run: new Date(Date.now() - 1800000).toISOString(),
          next_run: new Date(Date.now() + 1800000).toISOString(),
          run_count: 892,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Generate Reports',
          description: 'Génération des rapports hebdomadaires',
          schedule: '0 9 * * 1',
          schedule_type: 'cron',
          agent_id: null,
          status: 'completed',
          last_run: new Date(Date.now() - 604800000).toISOString(),
          next_run: new Date(Date.now() + 259200000).toISOString(),
          run_count: 48,
          created_at: '2024-02-01T14:00:00Z',
          updated_at: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Cleanup Temp Files',
          description: 'Nettoyage des fichiers temporaires',
          schedule: '0 3 * * *',
          schedule_type: 'cron',
          agent_id: '1',
          agent_name: 'Agent Principal',
          status: 'failed',
          last_run: new Date(Date.now() - 172800000).toISOString(),
          next_run: null,
          run_count: 203,
          created_at: '2024-02-15T11:00:00Z',
          updated_at: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Send Notifications',
          description: 'Envoi des notifications par email',
          schedule: '3600',
          schedule_type: 'interval',
          agent_id: null,
          status: 'disabled',
          last_run: new Date(Date.now() - 3600000).toISOString(),
          next_run: null,
          run_count: 1247,
          created_at: '2024-03-01T09:00:00Z',
          updated_at: new Date().toISOString(),
        },
      ];
      
      setAgents(mockAgents);
      setTasks(mockTasks);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setSelectedTask(null);
    setFormOpen(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setFormOpen(true);
  };

  const handleDelete = (task: Task) => {
    setDeleteDialog({ open: true, task });
  };

  const confirmDelete = async () => {
    if (deleteDialog.task) {
      try {
        setTasks((prev) => prev.filter((t) => t.id !== deleteDialog.task!.id));
        setDeleteDialog({ open: false, task: null });
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    const agent = agents.find((a) => a.id === data.agent_id);
    if (selectedTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id
            ? { ...t, ...data, agent_name: agent?.name, updated_at: new Date().toISOString() }
            : t
        )
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...data,
        agent_name: agent?.name,
        status: 'pending',
        last_run: null,
        next_run: new Date(Date.now() + 3600000).toISOString(),
        run_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const handleRunNow = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: 'running', last_run: new Date().toISOString() }
          : t
      )
    );
    // Simulation d'une exécution
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: 'completed' } : t
        )
      );
    }, 2000);
  };

  const handleToggleStatus = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: task.status === 'disabled' ? 'pending' : 'disabled' }
          : t
      )
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: fr });
    } catch {
      return '-';
    }
  };

  const getScheduleLabel = (task: Task) => {
    if (task.schedule_type === 'cron') return task.schedule;
    if (task.schedule_type === 'interval') return `Toutes les ${task.schedule}s`;
    return 'Une seule fois';
  };

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'running', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'failed', label: 'Échoué' },
    { value: 'disabled', label: 'Désactivé' },
  ];

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    running: tasks.filter((t) => t.status === 'running').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    failed: tasks.filter((t) => t.status === 'failed').length,
  };

  return (
    <Box>
      {loading && <LoadingOverlay message="Chargement des tâches..." />}
      
      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EventIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tâches
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ScheduleIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.pending}</Typography>
                  <Typography variant="body2">En attente</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EventIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.running}</Typography>
                  <Typography variant="body2">En cours</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.completed}</Typography>
                  <Typography variant="body2">Terminées</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Tâches Planifiées</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
            Actualiser
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
            Ajouter une Tâche
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tableau */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="Aucune tâche trouvée"
          description="Commencez par créer une nouvelle tâche planifiée pour automatiser vos processus."
          actionLabel="Ajouter une Tâche"
          onAction={handleAdd}
        />
      ) : (
        <Card>
          <CardContent>
            <SearchFilter
              search={search}
              onSearchChange={setSearch}
              filterOptions={statusOptions}
              filterValue={statusFilter}
              onFilterChange={setStatusFilter}
            />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Planification</TableCell>
                    <TableCell>Agent</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Exécutions</TableCell>
                    <TableCell>Dernière exécution</TableCell>
                    <TableCell>Prochaine exécution</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {task.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {task.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
                          label={getScheduleLabel(task)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {task.agent_name || (
                          <Typography variant="caption" color="text.secondary">
                            Automatique
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={task.status} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{task.run_count}</Typography>
                      </TableCell>
                      <TableCell>{formatDate(task.last_run)}</TableCell>
                      <TableCell>{formatDate(task.next_run)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title={task.status === 'running' ? 'Désactiver' : 'Activer'}>
                          <IconButton
                            size="small"
                            color={task.status === 'disabled' ? 'success' : 'default'}
                            onClick={() => handleToggleStatus(task)}
                          >
                            {task.status === 'disabled' ? <PlayArrowIcon /> : <StopIcon />}
                          </IconButton>
                        </Tooltip>
                        {task.status !== 'running' && (
                          <Tooltip title="Exécuter maintenant">
                            <IconButton size="small" color="primary" onClick={() => handleRunNow(task)}>
                              <PlayArrowIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEdit(task)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" color="error" onClick={() => handleDelete(task)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Formulaire */}
      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={selectedTask}
        agents={agents}
      />

      {/* Dialogue de confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Supprimer la tâche"
        message={`Êtes-vous sûr de vouloir supprimer la tâche "${deleteDialog.task?.name}" ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, task: null })}
      />
    </Box>
  );
};