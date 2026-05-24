export interface Task {
  id: number;
  name: string;
  description: string;
  script_path: string;
  schedule: string;
  is_active: boolean;
  agent_id: number;
}

export interface Agent {
  id: number;
  name: string;
  description: string;
  os: string;
  ip_address: string;
  last_seen: string;
  is_active: boolean;
}
