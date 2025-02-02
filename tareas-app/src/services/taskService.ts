// src/services/taskService.ts
import apiClient from './apiClient';
import { Task } from '../context/TaskContext';

interface CreateTaskDto {
  title: string;
  description?: string;
}

interface UpdateTaskDto {
  title: string;
  description?: string;
  completed?: boolean;
}

export const fetchTasks = async (token: string): Promise<Task[]> => {
  const response = await apiClient.get<Task[]>('/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTask = async (token: string, data: CreateTaskDto): Promise<Task> => {
  const response = await apiClient.post<Task>('/tasks', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTask = async (token: string, taskId: number, data: UpdateTaskDto): Promise<Task> => {
  const response = await apiClient.patch<Task>(`/tasks/${taskId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteTask = async (token: string, taskId: number): Promise<void> => {
  await apiClient.delete(`/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
