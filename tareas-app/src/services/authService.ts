// src/services/authService.ts
import apiClient from './apiClient';

interface AuthResponse {
  access_token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', { email, password });
  return response.data;
};
