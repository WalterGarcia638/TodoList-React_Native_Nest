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

   // Configuración de Swagger
   const swaggerConfig = new DocumentBuilder()
   .setTitle('API de Tareas')
   .setDescription('API para la gestión colaborativa de tareas')
   .setVersion('1.0')
   // Si usas autenticación JWT, puedes añadir la configuración del bearer token:
   .addBearerAuth({
     type: 'http',
     scheme: 'bearer',
     bearerFormat: 'JWT',
     description: 'Ingrese el token JWT aquí',
   })
   .build();

 const document = SwaggerModule.createDocument(app, swaggerConfig);
 
 // Configura Swagger en la raíz ('/') para que al acceder se muestre directamente Swagger
 SwaggerModule.setup('/', app, document, {
   customSiteTitle: 'API de Tareas', // Título de la pestaña en el navegador
 });


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
