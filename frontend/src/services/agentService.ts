import axios from 'axios';
import { Agent, AgentFormData } from '../types/agentTypes';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const agentService = {
  async getAll(): Promise<Agent[]> {
    const response = await apiClient.get('/agents');
    return response.data;
  },

  async getById(id: string): Promise<Agent> {
    const response = await apiClient.get(`/agents/${id}`);
    return response.data;
  },

  async create(data: AgentFormData): Promise<Agent> {
    const response = await apiClient.post('/agents', data);
    return response.data;
  },

  async update(id: string, data: Partial<AgentFormData>): Promise<Agent> {
    const response = await apiClient.put(`/agents/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/agents/${id}`);
  },

  async toggleStatus(id: string): Promise<Agent> {
    const response = await apiClient.post(`/agents/${id}/toggle-status`);
    return response.data;
  },

  async getStats(): Promise<{
    total: number;
    online: number;
    offline: number;
    busy: number;
  }> {
    const response = await apiClient.get('/agents/stats');
    return response.data;
  },
};

export default agentService;
