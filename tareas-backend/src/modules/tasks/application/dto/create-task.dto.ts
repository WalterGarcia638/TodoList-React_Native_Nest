import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Comprar alimentos',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descripción de la tarea',
    example: 'Comprar pan, leche y huevos',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
