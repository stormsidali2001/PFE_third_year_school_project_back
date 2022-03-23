"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const invitation_entity_1 = require("../core/entities/invitation.entity");
const student_entity_1 = require("../core/entities/student.entity");
const user_entity_1 = require("../core/entities/user.entity");
const typeorm_1 = require("typeorm");
let UserService = class UserService {
    async getUserInfo(userId) {
        const manager = (0, typeorm_1.getManager)();
        const userRepository = manager.getRepository(user_entity_1.UserEntity);
        let user;
        try {
            user = await userRepository.findOne({ id: userId });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getUserInfo');
            throw new common_1.HttpException("user not found", common_1.HttpStatus.BAD_REQUEST);
        }
        switch (user.userType) {
            case user_entity_1.UserType.STUDENT:
                const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
                let student;
                try {
                    student = await studentRepository.createQueryBuilder('student').where('student.userId =:id', { id: user.id }).getOne();
                }
                catch (err) {
                    common_1.Logger.error(err, 'UserService/getUserInfo');
                    throw new common_1.HttpException("user not found", common_1.HttpStatus.BAD_REQUEST);
                }
                return student;
                break;
            case user_entity_1.UserType.ENTERPRISE:
                break;
            case user_entity_1.UserType.ADMIN:
                break;
            case user_entity_1.UserType.TEACHER:
                break;
        }
    }
    async sendATeamInvitation(senderId, recieverId, description) {
        const manager = (0, typeorm_1.getManager)();
        try {
            const sender = await manager.getRepository(student_entity_1.StudentEntity).findOne({ id: senderId }, { relations: ['team', 'sentInvitations'] });
            const reciever = await manager.getRepository(student_entity_1.StudentEntity).findOne({ id: recieverId }, { relations: ['team', 'sentInvitations'] });
            if (reciever.team) {
                throw new common_1.HttpException("le destinataire doit etre sans equipe.", common_1.HttpStatus.BAD_REQUEST);
            }
            const invitationsRepository = manager.getRepository(invitation_entity_1.InvitationEntity);
            const invitation = invitationsRepository.create({ description, sender, reciever, accepted: false });
            await invitationsRepository.save(invitation);
            return JSON.stringify({ sender, reciever, description });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/sendATeamInvitation');
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map