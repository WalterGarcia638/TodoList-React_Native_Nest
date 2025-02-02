// src/modules/tasks/infrastructure/repositories/tasks.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from '../../domain/entities/task.entity';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, title: string, description?: string): Promise<Task> {
    return this.prisma.task.create({
      data: { userId, title, description },
    });
  }

  async findAll(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
    });
  }

  async findOne(userId: number, taskId: number): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });
  }

  async update(taskId: number, data: Partial<Task>): Promise<Task> {
    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  async delete(taskId: number): Promise<Task> {
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
