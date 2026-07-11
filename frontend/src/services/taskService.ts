import axios from 'axios';
import { Task, TaskFormData } from '../types/taskTypes';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  async getAll(): Promise<Task[]> {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  async getById(id: string): Promise<Task> {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  async create(data: TaskFormData): Promise<Task> {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  async update(id: string, data: Partial<TaskFormData>): Promise<Task> {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async toggleStatus(id: string): Promise<Task> {
    const response = await apiClient.post(`/tasks/${id}/toggle-status`);
    return response.data;
  },

  async runNow(id: string): Promise<Task> {
    const response = await apiClient.post(`/tasks/${id}/run`);
    return response.data;
  },

  async getStats(): Promise<{
    total: number;
    pending: number;
    running: number;
    completed: number;
    failed: number;
    disabled: number;
  }> {
    const response = await apiClient.get('/tasks/stats');
    return response.data;
  },
};

export default taskService;
