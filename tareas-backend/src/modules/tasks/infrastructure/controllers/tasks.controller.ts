/*import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { TasksService } from '../../application/services/tasks.service';
import { CreateTaskDto } from '../../application/dto/create-task.dto';
import { UpdateTaskDto } from '../../application/dto/update-task.dto';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(req.user.userId, createTaskDto);

    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req) {
    return this.tasksService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksService.update(req.user.userId, +id, updateTaskDto);

    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: string) {
    const task = await this.tasksService.delete(req.user.userId, +id);

    return task;
  }
}*/

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TasksService } from '../../application/services/tasks.service';
import { CreateTaskDto } from '../../application/dto/create-task.dto';
import { UpdateTaskDto } from '../../application/dto/update-task.dto';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth() // Indica que estos endpoints requieren un token JWT
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  async create(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(req.user.userId, createTaskDto);
    // Aquí podrías emitir la actualización en tiempo real (por ejemplo, mediante un gateway)
    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas del usuario autenticado' })
  async findAll(@Req() req) {
    return this.tasksService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea existente' })
  async update(@Req() req, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksService.update(req.user.userId, +id, updateTaskDto);
    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  async delete(@Req() req, @Param('id') id: string) {
    const task = await this.tasksService.delete(req.user.userId, +id);
    return task;
  }
}

