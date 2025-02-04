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

  emitTasksUpdate(userId: number) {

    this.server.emit('tasksUpdated', { userId });
  }
  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: any, @ConnectedSocket() client: Socket) {

    client.join(data.room);
  }
}
