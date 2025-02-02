// src/modules/tasks/domain/entities/task.entity.ts
export class Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    userId: number;
    createdAt: Date;
  }
  