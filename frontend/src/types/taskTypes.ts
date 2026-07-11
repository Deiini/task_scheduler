export interface Task {
  id: string;
  name: string;
  description: string;
  schedule: string;
  schedule_type: 'cron' | 'interval' | 'once';
  agent_id: string | null;
  agent_name?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'disabled';
  last_run: string | null;
  next_run: string | null;
  run_count: number;
  created_at: string;
  updated_at: string;
}

export interface TaskFormData {
  name: string;
  description: string;
  schedule: string;
  schedule_type: 'cron' | 'interval' | 'once';
  agent_id: string | null;
}

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'disabled';
export type ScheduleType = 'cron' | 'interval' | 'once';
