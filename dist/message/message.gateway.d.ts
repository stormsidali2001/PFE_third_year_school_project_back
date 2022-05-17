import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { SocketService } from 'src/socket/socket.service';
export declare class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private socketService;
    constructor(socketService: SocketService, getManager: any);
    server: Server;
    private users;
    private logger;
    handleMessage(client: Socket, payload: any): Promise<WsResponse<any>>;
    joinRoom(client: Socket, room: string): void;
    leaveRoom(client: Socket, room: string): void;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket): void;
}
