import { Task } from "../context/TaskContext";
import apiClient from "./apiClient";
import { createTask, deleteTask, fetchTasks, updateTask } from "./taskService";


// Mock del apiClient
jest.mock('@services/apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

describe('taskService', () => {
  const token = 'fake-jwt-token';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe obtener las tareas correctamente', async () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
      { id: 2, title: 'Task 2', description: 'Description 2', completed: true },
    ];
    
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTasks });

    const result = await fetchTasks(token);

    expect(apiClient.get).toHaveBeenCalledWith('/tasks', { headers: { Authorization: `Bearer ${token}` } });
    expect(result).toEqual(mockTasks);
  });

  it('debe crear una tarea correctamente', async () => {
    const newTask = { title: 'New Task', description: 'New Description' };
    const createdTask: Task = { id: 3, ...newTask, completed: false };

    (apiClient.post as jest.Mock).mockResolvedValue({ data: createdTask });

    const result = await createTask(token, newTask);

    expect(apiClient.post).toHaveBeenCalledWith('/tasks', newTask, { headers: { Authorization: `Bearer ${token}` } });
    expect(result).toEqual(createdTask);
  });

  it('debe actualizar una tarea correctamente', async () => {
    const taskId = 1;
    const updatedData = { title: 'Updated Task', completed: true };
    const updatedTask: Task = { id: taskId, ...updatedData, description: 'Description 1' };

    (apiClient.patch as jest.Mock).mockResolvedValue({ data: updatedTask });

    const result = await updateTask(token, taskId, updatedData);

    expect(apiClient.patch).toHaveBeenCalledWith(`/tasks/${taskId}`, updatedData, { headers: { Authorization: `Bearer ${token}` } });
    expect(result).toEqual(updatedTask);
  });

  it('debe eliminar una tarea correctamente', async () => {
    const taskId = 1;

    (apiClient.delete as jest.Mock).mockResolvedValue({});

    await deleteTask(token, taskId);

    expect(apiClient.delete).toHaveBeenCalledWith(`/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
  });

  it('debe manejar errores al obtener tareas', async () => {
    const errorMessage = 'Error al obtener tareas';
    (apiClient.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(fetchTasks(token)).rejects.toThrow(errorMessage);
  });

  it('debe manejar errores al crear una tarea', async () => {
    const newTask = { title: 'New Task' };
    const errorMessage = 'Error al crear tarea';

    (apiClient.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(createTask(token, newTask)).rejects.toThrow(errorMessage);
  });

  it('debe manejar errores al actualizar una tarea', async () => {
    const taskId = 1;
    const updatedData = { title: 'Updated Task' };
    const errorMessage = 'Error al actualizar tarea';

    (apiClient.patch as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(updateTask(token, taskId, updatedData)).rejects.toThrow(errorMessage);
  });

  it('debe manejar errores al eliminar una tarea', async () => {
    const taskId = 1;
    const errorMessage = 'Error al eliminar tarea';

    (apiClient.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(deleteTask(token, taskId)).rejects.toThrow(errorMessage);
  });
});
