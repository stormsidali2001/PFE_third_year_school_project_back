import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsResponse,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Socket } from 'socket.io';
  import { Server } from 'ws';
  import { SocketService } from 'src/socket/socket.service';
import passport from 'passport';
import * as cookieParser from 'cookie'
import { InjectEntityManager } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { SessionEntity } from 'src/core/entities/session.entity';


  
  @WebSocketGateway({
    cors:{
      credentials:true,
      origin:['http://localhost:3000'],
      methods:['POST','GET']
    }
   
})
  export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private socketService:SocketService ,@InjectEntityManager() getManager){}
    @WebSocketServer() 
    public server: Server;
    
    private users = {};
    private logger: Logger = new Logger('MessageGateway');
  
    @SubscribeMessage('msgToServer')
    public handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
      return this.server.to(payload.room).emit('msgToClient', payload);
    }
  
    @SubscribeMessage('joinRoom')
    public joinRoom(client: Socket, room: string): void {
      client.join(room);
      client.emit('joinedRoom', room);
    }
  
    @SubscribeMessage('leaveRoom')
    public leaveRoom(client: Socket, room: string): void {
      client.leave(room);
      client.emit('leftRoom', room);
    }
  
    public afterInit(server: Server): void {
      this.socketService.socket = server;
      return this.logger.log('Init');
    }
  
    public handleDisconnect(client: Socket): void {
      return this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    public handleConnection(client:Socket): void {
       
       
       this.logger.log(JSON.stringify(client.handshake.headers))
       
       this.logger.log(`cookie : ${JSON.stringify(cookieParser.parse(client.handshake.headers.cookie))}`);
      


       const sessionId = cookieParser.parse(client.handshake.headers.cookie).NESTJS_SESSION_ID;
       console.log("sessionId = ",sessionId)
       const manager = getManager();
      //  manager.getRepository(SessionEntity).createQueryBuilder('session')
      //  .where('session.id = ')
      //  .getOne()
      
     
    
      return this.logger.log(`Client connected: ${client.id}`);
    }
  }