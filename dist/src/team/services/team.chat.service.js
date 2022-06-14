"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamChatService = void 0;
const common_1 = require("@nestjs/common");
const student_entity_1 = require("../../core/entities/student.entity");
const team_chat_message_entity_1 = require("../../core/entities/team.chat.message.entity");
const typeorm_1 = require("typeorm");
let TeamChatService = class TeamChatService {
    async sendTeamChatMessage(studentId, message) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.findOne({ id: studentId }, { relations: ['team'] });
            if (!student) {
                common_1.Logger.error("student not found", 'UserService/sendTeamChatMessage');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            if (!student.team) {
                common_1.Logger.error("the student has no team", 'UserService/sendTeamChatMessage');
                throw new common_1.HttpException("the student has no team", common_1.HttpStatus.BAD_REQUEST);
            }
            const chatRepository = manager.getRepository(team_chat_message_entity_1.TeamChatMessageEntity);
            const chat = chatRepository.create({ message, team: student.team, owner: student });
            await chatRepository.save(chat);
            return `message sent with success to team: ${student.team.nickName} members`;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/sendTeamChatMessage');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamMessages(userId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const teamMessages = await manager.getRepository(team_chat_message_entity_1.TeamChatMessageEntity)
                .createQueryBuilder('messages')
                .leftJoinAndSelect('messages.owner', 'owner')
                .innerJoin('messages.team', 'team')
                .innerJoin('team.students', 'student')
                .where('student.userId = :userId', { userId })
                .orderBy('createdAt', 'ASC')
                .getMany();
            return teamMessages;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeams');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
TeamChatService = __decorate([
    (0, common_1.Injectable)()
], TeamChatService);
exports.TeamChatService = TeamChatService;
//# sourceMappingURL=team.chat.service.js.map