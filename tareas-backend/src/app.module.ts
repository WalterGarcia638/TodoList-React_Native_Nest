import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, TasksModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
