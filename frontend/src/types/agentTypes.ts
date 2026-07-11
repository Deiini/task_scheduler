export interface Agent {
  id: string;
  name: string;
  hostname: string;
  ip_address: string;
  status: 'online' | 'offline' | 'busy';
  capabilities: string[];
  last_heartbeat: string;
  tasks_count: number;
  cpu_usage: number;
  memory_usage: number;
  created_at: string;
  updated_at: string;
}

export interface AgentFormData {
  name: string;
  hostname: string;
  ip_address: string;
  capabilities: string[];
}

export type AgentStatus = 'online' | 'offline' | 'busy';
