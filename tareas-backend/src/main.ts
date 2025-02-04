import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();


   const swaggerConfig = new DocumentBuilder()
   .setTitle('API de Tareas')
   .setDescription('API para la gestión colaborativa de tareas')
   .setVersion('1.0')

   .addBearerAuth({
     type: 'http',
     scheme: 'bearer',
     bearerFormat: 'JWT',
     description: 'Ingrese el token JWT aquí',
   })
   .build();

 const document = SwaggerModule.createDocument(app, swaggerConfig);
 

 SwaggerModule.setup('/', app, document, {
   customSiteTitle: 'API de Tareas',
 });


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
