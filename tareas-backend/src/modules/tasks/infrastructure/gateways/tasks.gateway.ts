import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  // Emite un evento de actualización a todos los clientes conectados.
  emitTasksUpdate(userId: number) {
    // En una implementación real, podrías filtrar por sala o usuario
    this.server.emit('tasksUpdated', { userId });
  }

  // Ejemplo: suscribirse a un evento del cliente
  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // Lógica para unirse a una sala
    client.join(data.room);
  }
}
