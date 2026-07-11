import React, { useState } from 'react';
import { Box, Container, Tabs, Tab, Typography, AppBar, Toolbar, IconButton, Badge, Breadcrumbs, Link } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { AgentsManagement } from './AgentsManagement';
import { TasksManagement } from './TasksManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      style={{ width: '100%' }}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
}

export const Dashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <DashboardIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Scheduler
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Box sx={{ bgcolor: 'background.paper', px: 3, py: 1 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="#">
            Accueil
          </Link>
          <Typography color="text.primary">Dashboard</Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Container maxWidth="xl">
          {/* Page Title */}
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Tableau de Bord
          </Typography>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="dashboard tabs"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab
                label="Agents"
                icon={<DashboardIcon />}
                iconPosition="start"
                {...a11yProps(0)}
                sx={{ minHeight: 48 }}
              />
              <Tab
                label="Tâches Planifiées"
                icon={<DashboardIcon />}
                iconPosition="start"
                {...a11yProps(1)}
                sx={{ minHeight: 48 }}
              />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={currentTab} index={0}>
            <AgentsManagement />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <TasksManagement />
          </TabPanel>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Task Scheduler Dashboard © 2024 | Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
};