import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsResponse,
  } from '@nestjs/websockets';
  import { HttpException, HttpStatus, Logger } from '@nestjs/common';
  import { Socket } from 'socket.io';
  import { Server } from 'ws';
  import { SocketService } from 'src/socket/socket.service';
import passport from 'passport';
import * as cookieParser from 'cookie'
import { InjectEntityManager } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { SessionEntity } from 'src/core/entities/session.entity';
import { UserEntity, UserType } from 'src/core/entities/user.entity';
import { UserRepository } from 'src/core/repositories/user.repository';
import { StudentEntity } from 'src/core/entities/student.entity';
import { TeamChatMessageEntity } from 'src/core/entities/team.chat.message.entity';


  
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
    
   
    private users = {}
    private logger: Logger = new Logger('MessageGateway');
  
    @SubscribeMessage('teamMessageToServer')
    public async handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
      //@ts-ignore
      if(!client.request.isAuthenticated()){
        Logger.error('not authenticated','MessageGateway/teamMessageToServer')
        throw new HttpException("not authenticated",HttpStatus.FORBIDDEN)
       }
       //@ts-ignore
      const userId = client.request.session.passport.user.id;
      const manager = getManager();
      const user =  await manager.getRepository(UserEntity).createQueryBuilder('user')
      .where('user.id = :userId',{userId})
      .getOne();
      if(user.userType != UserType.STUDENT){
        Logger.error('not student','MessageGateway/teamMessageToServer')
        throw new HttpException("not student",HttpStatus.FORBIDDEN)
      }
      const student  =  await manager.getRepository(StudentEntity).createQueryBuilder('student')
      .where('student.userId = :userId',{userId})
      .leftJoinAndSelect('student.team','team')
      .getOne();


      const teamId = student.team.id;

      await manager.getRepository(TeamChatMessageEntity)
      .save({message:payload.txt,team:student.team,owner:student})
      
      Logger.log(`payload : ${JSON.stringify(payload)}`,'MessageGateway/teamMessageToServer')


      return this.server.to(teamId).emit('teamMessageToClient', payload);
    }
  
    @SubscribeMessage('joinTeamRoom')
    public  async joinRoom(client: Socket, room: string) {
      //@ts-ignore
      if(!client.request.isAuthenticated()){
        Logger.error('not authenticated','MessageGateway/handleConnection')
        throw new HttpException("not authenticated",HttpStatus.FORBIDDEN)
       }
       //@ts-ignore
      const userId = client?.request?.session?.passport?.user?.id;
      const manager = getManager();
      const user =  await manager.getRepository(UserEntity).createQueryBuilder('user')
      .where('user.id = :userId',{userId})
      .getOne();
      if(user.userType === UserType.STUDENT){
      
        const student  =  await manager.getRepository(StudentEntity).createQueryBuilder('student')
        .where('student.userId = :userId',{userId})
        .leftJoinAndSelect('student.team','team')
        .getOne();
        
        if(student?.team){
          const teamId = student?.team?.id;
         
                //@ts-ignore
          Logger.error(`user:${userId} joined the room teamId ${teamId} and room ${userId}`,"MessageGateWay/subscribe(joinTeamRoom)")
          client.join(teamId);

        }
  
       
      
     
      }

      Logger.error(`user:${userId} joined the room  ${userId}`,"MessageGateWay/subscribe(joinTeamRoom)")
   
      client.join(userId)
    

       
      
      // client.emit('joinedRoom', room);
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
       
        //@ts-ignore
       if(!client.request.isAuthenticated()){
        Logger.error('not authenticated','MessageGateway/handleConnection')
        throw new HttpException("not authenticated",HttpStatus.FORBIDDEN)
       }
        //@ts-ignore
       const userId = client.request.session.passport.user.id;
       console.log("client.request.session ",userId)
    
   
      
      
     
    
      return this.logger.log(`Client connected: ${client.id}`);
    }
  }