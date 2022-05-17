"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const ws_1 = require("ws");
const socket_service_1 = require("../socket/socket.service");
const cookieParser = require("cookie");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let MessageGateway = class MessageGateway {
    constructor(socketService, getManager) {
        this.socketService = socketService;
        this.users = {};
        this.logger = new common_1.Logger('MessageGateway');
    }
    handleMessage(client, payload) {
        return this.server.to(payload.room).emit('msgToClient', payload);
    }
    joinRoom(client, room) {
        client.join(room);
        client.emit('joinedRoom', room);
    }
    leaveRoom(client, room) {
        client.leave(room);
        client.emit('leftRoom', room);
    }
    afterInit(server) {
        this.socketService.socket = server;
        return this.logger.log('Init');
    }
    handleDisconnect(client) {
        return this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleConnection(client) {
        this.logger.log(JSON.stringify(client.handshake.headers));
        this.logger.log(`cookie : ${JSON.stringify(cookieParser.parse(client.handshake.headers.cookie))}`);
        const sessionId = cookieParser.parse(client.handshake.headers.cookie).NESTJS_SESSION_ID;
        console.log("sessionId = ", sessionId);
        const manager = (0, typeorm_2.getManager)();
        return this.logger.log(`Client connected: ${client.id}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _a : Object)
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('msgToServer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], MessageGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], MessageGateway.prototype, "leaveRoom", null);
MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            credentials: true,
            origin: ['http://localhost:3000'],
            methods: ['POST', 'GET']
        }
    }),
    __param(1, (0, typeorm_1.InjectEntityManager)()),
    __metadata("design:paramtypes", [socket_service_1.SocketService, Object])
], MessageGateway);
exports.MessageGateway = MessageGateway;
//# sourceMappingURL=message.gateway.js.map