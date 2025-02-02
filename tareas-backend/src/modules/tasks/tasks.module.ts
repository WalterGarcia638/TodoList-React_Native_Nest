// src/modules/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksService } from './application/services/tasks.service';
import { TasksController } from './infrastructure/controllers/tasks.controller';
import { TasksGateway } from './infrastructure/gateways/tasks.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { TasksRepository } from './infrastructure/repositories/tasks.repository';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksGateway, PrismaService, TasksRepository],
})
export class TasksModule {}
