import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { AuthContext } from './AuthContext';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

interface TaskContextProps {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (title: string, description?: string) => Promise<void>;
  editTask: (id: number, title: string, description?: string, completed?: boolean) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
}

export const TaskContext = createContext<TaskContextProps>({
  tasks: [],
  loadTasks: async () => {},
  addTask: async () => {},
  editTask: async () => {},
  removeTask: async () => {},
});

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    if (token) {
      const fetchedTasks = await fetchTasks(token);
      setTasks(fetchedTasks);
    }
  };

  const addTask = async (title: string, description?: string) => {
    if (token) {
      const newTask = await createTask(token, { title, description });
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const editTask = async (id: number, title: string, description?: string, completed?: boolean) => {
    if (token) {
      const updatedTask = await updateTask(token, id, { title, description, completed });
      setTasks((prev) => prev.map(task => task.id === id ? updatedTask : task));
    }
  };

  const removeTask = async (id: number) => {
    if (token) {
      await deleteTask(token, id);
      setTasks((prev) => prev.filter(task => task.id !== id));
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token]);

  return (
    <TaskContext.Provider value={{ tasks, loadTasks, addTask, editTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};
