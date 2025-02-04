import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';

import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

const mockPrismaService = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const userId = 1;
      const createTaskDto: CreateTaskDto = { title: 'Test Task', description: 'Test Description' };
      const createdTask = { id: 1, ...createTaskDto, userId };
      mockPrismaService.task.create.mockResolvedValue(createdTask);

      const result = await service.create(userId, createTaskDto);

      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: { ...createTaskDto, userId },
      });
      expect(result).toEqual(createdTask);
    });

    it('should throw BadRequestException if title is missing', async () => {
      const userId = 1;
      const createTaskDto: CreateTaskDto = { title: '', description: 'Test Description' };

      await expect(service.create(userId, createTaskDto)).rejects.toThrowError(BadRequestException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const userId = 1;
      const createTaskDto: CreateTaskDto = { title: 'Test Task' };
      mockPrismaService.task.create.mockRejectedValue(new Error());

      await expect(service.create(userId, createTaskDto)).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const userId = 1;
      const tasks = [{ id: 1, title: 'Task 1', userId }, { id: 2, title: 'Task 2', userId }];
      mockPrismaService.task.findMany.mockResolvedValue(tasks);

      const result = await service.findAll(userId);

      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual(tasks);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const userId = 1;
      mockPrismaService.task.findMany.mockRejectedValue(new Error());

      await expect(service.findAll(userId)).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const userId = 1;
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task', description: 'Updated Description' };
      const existingTask = { id: taskId, title: 'Original Task', description: 'Original Description', userId };
      const updatedTask = { id: taskId, ...updateTaskDto, userId };

      mockPrismaService.task.findFirst.mockResolvedValue(existingTask);
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      const result = await service.update(userId, taskId, updateTaskDto);

      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({ where: { id: taskId, userId } });
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: { ...updateTaskDto, title: updateTaskDto.title, description: updateTaskDto.description}, // Asegúrate de incluir los campos que se actualizan
      });
      expect(result).toEqual(updatedTask);
    });

    it('should throw BadRequestException if no fields to update', async () => {
      const userId = 1;
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {};

      await expect(service.update(userId, taskId, updateTaskDto)).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if task not found or no permissions', async () => {
      const userId = 1;
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(service.update(userId, taskId, updateTaskDto)).rejects.toThrowError(NotFoundException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const userId = 1;
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      mockPrismaService.task.findFirst.mockResolvedValue({ id: taskId, userId });
      mockPrismaService.task.update.mockRejectedValue(new Error());

      await expect(service.update(userId, taskId, updateTaskDto)).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const userId = 1;
      const taskId = 1;
      const taskToDelete = { id: taskId, title: 'Task to Delete', userId };
      mockPrismaService.task.findFirst.mockResolvedValue(taskToDelete);
      mockPrismaService.task.delete.mockResolvedValue(taskToDelete);

      const result = await service.delete(userId, taskId);

      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({ where: { id: taskId, userId } });
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(result).toEqual(taskToDelete);
    });

    it('should throw NotFoundException if task not found or no permissions', async () => {
      const userId = 1;
      const taskId = 1;
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(service.delete(userId, taskId)).rejects.toThrowError(NotFoundException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const userId = 1;
      const taskId = 1;
      mockPrismaService.task.findFirst.mockResolvedValue({ id: taskId, userId });
      mockPrismaService.task.delete.mockRejectedValue(new Error());

      await expect(service.delete(userId, taskId)).rejects.toThrowError(InternalServerErrorException);
    });
  });
});