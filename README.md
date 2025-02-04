Markdown

# Aplicación de Gestión de Tareas con NestJS y React Native

Este repositorio contiene una aplicación de gestión de tareas construida con NestJS (Backend) y React Native (Frontend). La aplicación permite crear, editar, eliminar y completar tareas, con autenticación de usuario y soporte para modo oscuro en el frontend.

##  Backend - NestJS

###  Requisitos Previos

Antes de ejecutar el backend, asegúrate de tener instalado:

*   Node.js (versión 18 o superior)
*   Docker para ejecutar la base de datos sin instalarla manualmente
*   Prisma como ORM para la base de datos

###  Ejecutar la Base de Datos con Docker

Si no tienes PostgreSQL instalado, puedes usar Docker con el siguiente comando:

```bash
docker run --name postgres-tareas -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tareas -p 5432:5432 -d postgres
Esto iniciará una base de datos PostgreSQL en un contenedor.

Si deseas manejarla mejor con docker-compose, crea un archivo docker-compose.yml en la raíz del backend con el siguiente contenido:

YAML

version: '3.8'
services:
  postgres:
    image: postgres:latest
    container_name: postgres-tareas
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: tareas
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
Ejecuta PostgreSQL con:

Bash

docker-compose up -d
Instalación del Backend
Clona el repositorio:

Bash

git clone [https://github.com/tu_usuario/tu_repositorio.git](https://github.com/tu_usuario/tu_repositorio.git)
cd tu_repositorio/tareas-backend
Instala las dependencias:

Bash

npm install
Configura las variables de entorno .env:

Bash

cp .env.example .env
Luego edita el archivo .env y asegúrate de que tenga el siguiente contenido:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tareas?schema=public"
JWT_SECRET="clave-segura"
PORT=3000
Genera la base de datos con Prisma:

Bash

npx prisma migrate dev --name init
Si necesitas poblar la base de datos con datos iniciales:

Bash

npx prisma db seed
▶ Ejecutar el Servidor
Para iniciar el servidor en modo desarrollo:

Bash

npm run start:dev
Para producción:

Bash

npm run build
npm run start
Ejecución de Pruebas
Bash

npm run test
Documentación API con Swagger
Una vez que el servidor esté en ejecución, puedes acceder a la documentación de la API en:

http://localhost:3000/api

Frontend - React Native
Requisitos Previos
Antes de ejecutar el frontend, asegúrate de tener instalado:

Node.js (versión 18 o superior)
Expo CLI
Un emulador de Android/iOS o un dispositivo físico
Instalación
Clona el repositorio:

Bash

git clone [https://github.com/tu_usuario/tu_repositorio.git](https://github.com/tu_usuario/tu_repositorio.git)
cd tu_repositorio/tareas-frontend
Instala las dependencias:

Bash

npm install
Configura las variables de entorno .env:

Bash

cp .env.example .env
Luego edita el archivo .env y asegúrate de que tenga el siguiente contenido:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tareas?schema=public"

▶ Ejecutar la Aplicación
Para iniciar la app en Expo:

Bash

npm start
Si usas un emulador, puedes correr:

Bash

npm run android # Para Android
npm run ios # Para iOS
Cambiar entre Modo Claro y Oscuro
Desde la pantalla de tareas, puedes alternar entre modo claro y oscuro desde la configuración de la app.

Características Implementadas
✅ Backend en NestJS
Autenticación con JWT
CRUD de tareas con Prisma y PostgreSQL
Soporte para Docker y Docker Compose
Pruebas unitarias con Jest
Documentación con Swagger
✅ Frontend en React Native
Expo para desarrollo ágil
Context API para gestión de estado
Dark Mode integrado
Soporte para edición y eliminación de tareas
Licencia
Este proyecto está bajo la Licencia MIT.
