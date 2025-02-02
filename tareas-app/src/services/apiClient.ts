// src/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Ajusta esta URL según la dirección de tu backend
  timeout: 5000,
});

export default apiClient;
