import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class RewardsGateway {
    @WebSocketServer()
    server: Server;
  
    @SubscribeMessage('joinUserRoom')
    handleJoinRoom(
      @MessageBody() data: { userId: string },
      @ConnectedSocket() client: Socket,
    ) {
      client.join(`user-${data.userId}`);
      client.emit('joined', { room: `user-${data.userId}` });
    }
  
    notifyPointsUpdate(userId: string, points: number) {
      this.server.to(`user-${userId}`).emit('pointsUpdated', { points });
    }
  
    notifyNewTransaction(userId: string, transaction: any) {
      this.server.to(`user-${userId}`).emit('newTransaction', transaction);
    }
  
    notifyRedemption(userId: string, redemption: any) {
      this.server.to(`user-${userId}`).emit('redemption', redemption);
    }
  }