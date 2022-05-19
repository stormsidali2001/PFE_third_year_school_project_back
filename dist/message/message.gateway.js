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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../core/entities/user.entity");
const student_entity_1 = require("../core/entities/student.entity");
const team_chat_message_entity_1 = require("../core/entities/team.chat.message.entity");
let MessageGateway = class MessageGateway {
    constructor(socketService, getManager) {
        this.socketService = socketService;
        this.users = {};
        this.logger = new common_1.Logger('MessageGateway');
    }
    async handleMessage(client, payload) {
        if (!client.request.isAuthenticated()) {
            common_1.Logger.error('not authenticated', 'MessageGateway/teamMessageToServer');
            throw new common_1.HttpException("not authenticated", common_1.HttpStatus.FORBIDDEN);
        }
        const userId = client.request.session.passport.user.id;
        const manager = (0, typeorm_2.getManager)();
        const user = await manager.getRepository(user_entity_1.UserEntity).createQueryBuilder('user')
            .where('user.id = :userId', { userId })
            .getOne();
        if (user.userType != user_entity_1.UserType.STUDENT) {
            common_1.Logger.error('not student', 'MessageGateway/teamMessageToServer');
            throw new common_1.HttpException("not student", common_1.HttpStatus.FORBIDDEN);
        }
        const student = await manager.getRepository(student_entity_1.StudentEntity).createQueryBuilder('student')
            .where('student.userId = :userId', { userId })
            .leftJoinAndSelect('student.team', 'team')
            .getOne();
        const teamId = student.team.id;
        await manager.getRepository(team_chat_message_entity_1.TeamChatMessageEntity)
            .save({ message: payload.txt, team: student.team, owner: student });
        common_1.Logger.log(`payload : ${JSON.stringify(payload)}`, 'MessageGateway/teamMessageToServer');
        return this.server.to(teamId).emit('teamMessageToClient', payload);
    }
    async joinRoom(client, room) {
        if (!client.request.isAuthenticated()) {
            common_1.Logger.error('not authenticated', 'MessageGateway/handleConnection');
            throw new common_1.HttpException("not authenticated", common_1.HttpStatus.FORBIDDEN);
        }
        const userId = client.request.session.passport.user.id;
        const manager = (0, typeorm_2.getManager)();
        const user = await manager.getRepository(user_entity_1.UserEntity).createQueryBuilder('user')
            .where('user.id = :userId', { userId })
            .getOne();
        if (user.userType != user_entity_1.UserType.STUDENT) {
            common_1.Logger.error('not student', 'MessageGateway/handleConnection');
            throw new common_1.HttpException("not student", common_1.HttpStatus.FORBIDDEN);
        }
        const student = await manager.getRepository(student_entity_1.StudentEntity).createQueryBuilder('student')
            .where('student.userId = :userId', { userId })
            .leftJoinAndSelect('student.team', 'team')
            .getOne();
        const teamId = student.team.id;
        common_1.Logger.log(`user:${userId} joined the room teamId ${teamId}`, "MessageGateWay/subscribe(joinTeamRoom)");
        client.join(teamId);
        client.join(student.id);
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
        if (!client.request.isAuthenticated()) {
            common_1.Logger.error('not authenticated', 'MessageGateway/handleConnection');
            throw new common_1.HttpException("not authenticated", common_1.HttpStatus.FORBIDDEN);
        }
        const userId = client.request.session.passport.user.id;
        console.log("client.request.session ", userId);
        return this.logger.log(`Client connected: ${client.id}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _a : Object)
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('teamMessageToServer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinTeamRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
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