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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamInvitationService = void 0;
const common_1 = require("@nestjs/common");
const invitation_entity_1 = require("../../core/entities/invitation.entity");
const student_entity_1 = require("../../core/entities/student.entity");
const team_entity_1 = require("../../core/entities/team.entity");
const socket_service_1 = require("../../socket/socket.service");
const user_service_1 = require("../../user/user.service");
const typeorm_1 = require("typeorm");
let TeamInvitationService = class TeamInvitationService {
    constructor(userService, socketService) {
        this.userService = userService;
        this.socketService = socketService;
    }
    async sendATeamInvitation(userId, recieverId, description) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const sender = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .leftJoinAndSelect('student.promotion', 'promotion')
                .where('student.userId = :userId', { userId })
                .getOne();
            if (!sender) {
                common_1.Logger.error("sender not found", 'UserService/sendATeamInvitation');
                throw new common_1.HttpException("sender not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const reciever = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .leftJoinAndSelect('student.promotion', 'promotion')
                .where('student.teamId IS  NULL')
                .andWhere('student.id = :recieverId', { recieverId })
                .getOne();
            if (!reciever) {
                common_1.Logger.error("reciever not found", 'UserService/sendATeamInvitation');
                throw new common_1.HttpException("receiver not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const sentInvitationCount = await manager.getRepository(invitation_entity_1.InvitationEntity)
                .createQueryBuilder('invitation')
                .where('invitation.senderId = :senderId', { senderId: sender.id })
                .andWhere('invitation.recieverId = :recieverId', { recieverId })
                .getCount();
            if (sentInvitationCount !== 0) {
                common_1.Logger.error("you v'e already send an invitation to that particular user", 'UserService/sendATeamInvitation');
                throw new common_1.HttpException("you v'e already send an invitation to that particular user", common_1.HttpStatus.BAD_REQUEST);
            }
            if (sender.promotion.id !== reciever.promotion.id) {
                common_1.Logger.error("the sender and reciever should be in the same promotion", 'UserService/sendATeamInvitation');
                throw new common_1.HttpException("the sender and reciever should be in the same promotion", common_1.HttpStatus.BAD_REQUEST);
            }
            const invitationsRepository = manager.getRepository(invitation_entity_1.InvitationEntity);
            const invitation = invitationsRepository.create({ description, sender, reciever });
            await invitationsRepository.save(invitation);
            this.userService._sendNotficationStudent(reciever.id, `vous avez une nouvelle invitation de jointure de ${sender.firstName} ${reciever.lastName}`);
            return `Invitation sent succesfully to ${reciever.firstName} ${reciever.lastName} of the promotion ${sender.promotion.name}`;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/sendATeamInvitation');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async acceptRefuseTeamInvitation(invitationId, userId, accepted) {
        try {
            let newTeamCreated = false;
            let invitation;
            const manager = (0, typeorm_1.getManager)();
            let outputMessage = `invitation has been accepted`;
            const invitationsRepository = manager.getRepository(invitation_entity_1.InvitationEntity);
            invitation = await invitationsRepository
                .createQueryBuilder('invitation')
                .leftJoinAndSelect('invitation.sender', 'sender')
                .leftJoinAndSelect('invitation.reciever', 'reciever')
                .leftJoinAndSelect('sender.team', 'steam')
                .leftJoinAndSelect('reciever.team', 'rteam')
                .leftJoinAndSelect('reciever.user', 'ruser')
                .leftJoinAndSelect('sender.promotion', 'spromotion')
                .where('invitation.id = :invitationId', { invitationId })
                .andWhere('reciever.userId = :userId', { userId })
                .getOne();
            if (!invitation) {
                common_1.Logger.error("invitation not found", 'UserService/getAcceptRefuseTeamInvitation');
                throw new common_1.HttpException("invitation not found", common_1.HttpStatus.FORBIDDEN);
            }
            if (!accepted) {
                await invitationsRepository.delete({ id: invitation.id });
                this.userService._sendNotficationStudent(invitation.sender.id, `${invitation.reciever.firstName} ${invitation.reciever.lastName} refused your invitation `);
                return "the invitation has been refused";
            }
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                if (!invitation.sender.team) {
                    const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
                    const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
                    const teamLength = await teamRepository
                        .createQueryBuilder('team')
                        .getCount();
                    newTeamCreated = true;
                    const newTeam = teamRepository.create({ nickName: 'team' + teamLength, teamLeader: invitation.sender, promotion: invitation.sender.promotion });
                    await teamRepository.save(newTeam);
                    invitation.reciever.team = newTeam;
                    invitation.sender.team = newTeam;
                    await studentRepository.save(invitation.reciever);
                    await studentRepository.save(invitation.sender);
                }
                else {
                    invitation.reciever.team = invitation.sender.team;
                    await manager.getRepository(student_entity_1.StudentEntity).save(invitation.reciever);
                }
                await invitationsRepository.createQueryBuilder()
                    .delete()
                    .where('invitation.recieverId = :recieverId', { recieverId: invitation.reciever.id })
                    .execute();
            });
            if (newTeamCreated) {
                outputMessage += `\n team: ${invitation.sender.team.nickName} was created.`;
                await this.userService._sendTeamNotfication(invitation.sender.team.id, `you are now in the new team: ${invitation.sender.team.nickName} .`);
                const socket = this.socketService.socket;
                await socket.to(invitation.reciever.user.id).emit("refresh");
            }
            else {
                outputMessage += `\n ${invitation.reciever.firstName + ' ' + invitation.reciever.lastName} joined the ${invitation.reciever.team.nickName}.`;
                await this.userService._sendTeamNotfication(invitation.sender.team.id, `${invitation.reciever.firstName} ${invitation.reciever.lastName} joined your team`, invitation.reciever.id, `you joined the team: ${invitation.sender.team.nickName} successfully...`);
            }
            return outputMessage;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getAcceptRefuseTeamInvitation');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendTeamJoinRequest(senderId, teamId, description) {
        const manager = (0, typeorm_1.getManager)();
        const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
        try {
            const team = await teamRepository.findOne({ id: teamId }, { relations: ['teamLeader'] });
            if (!team) {
                common_1.Logger.error("team not found", 'userService/sendTeamJoinRequest');
                throw new common_1.HttpException("team not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.findOne({ id: senderId }, { relations: ['team'] });
            if (!student) {
                common_1.Logger.error("student not found", 'userService/sendTeamJoinRequest');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            if (student.team) {
                common_1.Logger.error("student already in a team", 'userService/sendTeamJoinRequest');
                throw new common_1.HttpException("student already in a team", common_1.HttpStatus.BAD_REQUEST);
            }
            const invitationsRepository = manager.getRepository(invitation_entity_1.InvitationEntity);
            const invitation = invitationsRepository.create({ sender: student, reciever: team.teamLeader, description });
            await invitationsRepository.save(invitation);
            return `invitation sent with success from: ${student.firstName + ' ' + student.lastName} to team: ${team.nickName}`;
        }
        catch (err) {
            common_1.Logger.error(err, 'userService/sendTeamJoinRequest');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getStudentsWithoutTeam(userId) {
        const manager = (0, typeorm_1.getManager)();
        try {
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            return await studentRepository.createQueryBuilder('student')
                .where(qb => {
                const subQuery = qb.subQuery()
                    .select('student.promotionId')
                    .from(student_entity_1.StudentEntity, 'student')
                    .where('student.userId = :userId', { userId })
                    .getQuery();
                return 'student.promotionId  IN ' + subQuery;
            })
                .andWhere('student.userId <> :userId', { userId })
                .andWhere('student.teamId IS NULL')
                .getMany();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getStudentsWithoutTeam');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getInvitationList(userId) {
        const manager = (0, typeorm_1.getManager)();
        const invitationsRepository = manager.getRepository(invitation_entity_1.InvitationEntity);
        try {
            const invitations = await invitationsRepository
                .createQueryBuilder('invitation')
                .leftJoinAndSelect('invitation.reciever', 'reciever')
                .where('reciever.userId = :userId', { userId })
                .leftJoinAndSelect('invitation.sender', 'sender')
                .leftJoinAndSelect('sender.team', 'team')
                .getMany();
            const reponses = invitations.map(inv => {
                const { id, description, sender } = inv;
                if (sender.team) {
                    return {
                        id,
                        description,
                        senderTeam: {
                            id: sender.team.id,
                            nickname: sender.team.nickName,
                            teamLeader: {
                                id: sender.id,
                                firstname: sender.firstName,
                                lastName: sender.lastName
                            }
                        }
                    };
                }
                else {
                    return {
                        id,
                        description,
                        student: {
                            id: sender.id,
                            firstname: sender.firstName,
                            lastName: sender.lastName
                        }
                    };
                }
            });
            return reponses;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getInvitationList');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getInvitations(studentId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const invitationsRepository = manager.getRepository(invitation_entity_1.InvitationEntity);
            const student = await studentRepository.findOne({ id: studentId });
            if (!student) {
                common_1.Logger.error("student not found", 'UserService/getInvitations');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const invitations = await invitationsRepository.createQueryBuilder('invitation').leftJoinAndSelect('invitation.sender', 'sender').getMany();
            if (!invitations) {
                common_1.Logger.error(`invitations related to: ${student.firstName + ' ' + student.lastName} not found`, 'UserService/getInvitations');
                throw new common_1.HttpException(`invitations related to: ${student.firstName + ' ' + student.lastName} not found`, common_1.HttpStatus.BAD_REQUEST);
            }
            return invitations;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getInvitations');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
TeamInvitationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        socket_service_1.SocketService])
], TeamInvitationService);
exports.TeamInvitationService = TeamInvitationService;
//# sourceMappingURL=team.invitation.service.js.map