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
  LinearProgress,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import ComputerIcon from '@mui/icons-material/Computer';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { Agent } from '../../types/agentTypes';
import { StatusChip } from './components/StatusChip';
import { SearchFilter } from './components/SearchFilter';
import { AgentForm } from './components/AgentForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { EmptyState } from './components/EmptyState';
import { LoadingOverlay } from './components/LoadingOverlay';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const AgentsManagement: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; agent: Agent | null }>({
    open: false,
    agent: null,
  });

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulation des données (à remplacer par un appel API)
      const mockAgents: Agent[] = [
        {
          id: '1',
          name: 'Agent Principal',
          hostname: 'srv-web-01',
          ip_address: '192.168.1.10',
          status: 'online',
          capabilities: ['Web Scraping', 'Data Processing'],
          last_heartbeat: new Date().toISOString(),
          tasks_count: 5,
          cpu_usage: 45,
          memory_usage: 62,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Agent Secondary',
          hostname: 'srv-data-02',
          ip_address: '192.168.1.11',
          status: 'busy',
          capabilities: ['Data Processing', 'API Integration'],
          last_heartbeat: new Date(Date.now() - 300000).toISOString(),
          tasks_count: 8,
          cpu_usage: 89,
          memory_usage: 78,
          created_at: '2024-02-20T14:30:00Z',
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Agent Backup',
          hostname: 'srv-backup-03',
          ip_address: '192.168.1.12',
          status: 'offline',
          capabilities: ['File Transfer', 'Database Operations'],
          last_heartbeat: new Date(Date.now() - 86400000).toISOString(),
          tasks_count: 2,
          cpu_usage: 0,
          memory_usage: 0,
          created_at: '2024-03-10T09:15:00Z',
          updated_at: new Date().toISOString(),
        },
      ];
      setAgents(mockAgents);
    } catch (err) {
      setError('Erreur lors du chargement des agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.hostname.toLowerCase().includes(search.toLowerCase()) ||
      agent.ip_address.includes(search);
    const matchesStatus = !statusFilter || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setSelectedAgent(null);
    setFormOpen(true);
  };

  const handleEdit = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormOpen(true);
  };

  const handleDelete = (agent: Agent) => {
    setDeleteDialog({ open: true, agent });
  };

  const confirmDelete = async () => {
    if (deleteDialog.agent) {
      try {
        setAgents((prev) => prev.filter((a) => a.id !== deleteDialog.agent!.id));
        setDeleteDialog({ open: false, agent: null });
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (selectedAgent) {
      setAgents((prev) =>
        prev.map((a) => (a.id === selectedAgent.id ? { ...a, ...data, updated_at: new Date().toISOString() } : a))
      );
    } else {
      const newAgent: Agent = {
        id: Date.now().toString(),
        ...data,
        status: 'online',
        last_heartbeat: new Date().toISOString(),
        tasks_count: 0,
        cpu_usage: 0,
        memory_usage: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setAgents((prev) => [...prev, newAgent]);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: fr });
    } catch {
      return '-';
    }
  };

  const statusOptions = [
    { value: 'online', label: 'En ligne' },
    { value: 'offline', label: 'Hors ligne' },
    { value: 'busy', label: 'Occupé' },
  ];

  const stats = {
    total: agents.length,
    online: agents.filter((a) => a.status === 'online').length,
    offline: agents.filter((a) => a.status === 'offline').length,
    busy: agents.filter((a) => a.status === 'busy').length,
  };

  return (
    <Box>
      {loading && <LoadingOverlay message="Chargement des agents..." />}
      
      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ComputerIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Agents
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WifiIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.online}</Typography>
                  <Typography variant="body2">En ligne</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ComputerIcon color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.busy}</Typography>
                  <Typography variant="body2">Occupés</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'grey.200' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WifiOffIcon color="disabled" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.offline}</Typography>
                  <Typography variant="body2">Hors ligne</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Liste des Agents</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchAgents}>
            Actualiser
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
            Ajouter un Agent
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tableau */}
      {filteredAgents.length === 0 ? (
        <EmptyState
          title="Aucun agent trouvé"
          description="Commencez par ajouter un nouvel agent pour gérer vos tâches planifiées."
          actionLabel="Ajouter un Agent"
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
                    <TableCell>Hostname</TableCell>
                    <TableCell>Adresse IP</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Capacités</TableCell>
                    <TableCell>Tâches</TableCell>
                    <TableCell>CPU / RAM</TableCell>
                    <TableCell>Dernière connexion</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {agent.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{agent.hostname}</TableCell>
                      <TableCell>{agent.ip_address}</TableCell>
                      <TableCell>
                        <StatusChip status={agent.status} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {agent.capabilities.slice(0, 2).map((cap) => (
                            <Chip key={cap} label={cap} size="small" variant="outlined" />
                          ))}
                          {agent.capabilities.length > 2 && (
                            <Chip label={`+${agent.capabilities.length - 2}`} size="small" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{agent.tasks_count}</TableCell>
                      <TableCell>
                        <Box sx={{ width: 80 }}>
                          <Typography variant="caption">CPU: {agent.cpu_usage}%</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={agent.cpu_usage}
                            color={agent.cpu_usage > 80 ? 'error' : 'primary'}
                            sx={{ mb: 0.5 }}
                          />
                          <Typography variant="caption">RAM: {agent.memory_usage}%</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={agent.memory_usage}
                            color={agent.memory_usage > 80 ? 'error' : 'secondary'}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(agent.last_heartbeat)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEdit(agent)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" color="error" onClick={() => handleDelete(agent)}>
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
      <AgentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        agent={selectedAgent}
      />

      {/* Dialogue de confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Supprimer l'agent"
        message={`Êtes-vous sûr de vouloir supprimer l'agent "${deleteDialog.agent?.name}" ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, agent: null })}
      />
    </Box>
  );
};