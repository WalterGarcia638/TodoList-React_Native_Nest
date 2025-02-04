import apiClient from './apiClient';
import { login, register } from './authService';



jest.mock('@services/apiClient', () => ({
  post: jest.fn(),
}));

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe llamar a la API de login con el email y password correctos', async () => {
    const mockResponse = { data: { access_token: 'fake-token' } };
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const email = 'test@example.com';
    const password = 'password123';

    const result = await login(email, password);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', { email, password });
    expect(result).toEqual(mockResponse.data);
  });

  it('debe llamar a la API de register con el email y password correctos', async () => {
    const mockResponse = { data: { access_token: 'fake-token' } };
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const email = 'test@example.com';
    const password = 'password123';

    const result = await register(email, password);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', { email, password });
    expect(result).toEqual(mockResponse.data);
  });

  it('debe manejar errores en el login', async () => {
    const mockError = new Error('Error de autenticación');
    (apiClient.post as jest.Mock).mockRejectedValue(mockError);

    const email = 'test@example.com';
    const password = 'wrongpassword';

    await expect(login(email, password)).rejects.toThrow('Error de autenticación');
  });

  it('debe manejar errores en el registro', async () => {
    const mockError = new Error('Error de registro');
    (apiClient.post as jest.Mock).mockRejectedValue(mockError);

    const email = 'test@example.com';
    const password = 'weakpassword';

    await expect(register(email, password)).rejects.toThrow('Error de registro');
  });
});
