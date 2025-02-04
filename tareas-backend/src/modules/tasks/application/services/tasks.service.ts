import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { HttpException } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTaskDto: CreateTaskDto) {
    if (!createTaskDto.title) {
      throw new BadRequestException('El título de la tarea es obligatorio');
    }

    try {
      return await this.prisma.task.create({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description || null,
          userId,
        },
      });
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      throw new InternalServerErrorException('Error al crear la tarea');
    }
  }

  async findAll(userId: number) {
    try {
      return await this.prisma.task.findMany({
        where: { userId },
      });
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      throw new InternalServerErrorException('Error al obtener las tareas');
    }
  }

  async update(userId: number, taskId: number, updateTaskDto: UpdateTaskDto) {
    if (!updateTaskDto.title && !updateTaskDto.description) {
      throw new BadRequestException('Debe proporcionar al menos un campo para actualizar');
    }
  
    try {
      const task = await this.prisma.task.findFirst({
        where: { id: taskId, userId },
      });
  
      if (!task) {
        throw new NotFoundException('Tarea no encontrada o no tienes permisos');
      }
  
      return await this.prisma.task.update({
        where: { id: taskId },
        data: {
          title: updateTaskDto.title ?? task.title,
          description: updateTaskDto.description ?? task.description,
          completed: updateTaskDto.completed !== undefined ? updateTaskDto.completed : task.completed,
        },
      });
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      // Si el error es una instancia de HttpException, se re-lanza directamente.
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar la tarea');
    }
  }
  
  async delete(userId: number, taskId: number) {
    try {
      const task = await this.prisma.task.findFirst({
        where: { id: taskId, userId },
      });
  
      if (!task) {
        throw new NotFoundException('Tarea no encontrada o no tienes permisos para eliminarla');
      }
  
      return await this.prisma.task.delete({
        where: { id: taskId },
      });
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar la tarea');
    }
  }
}