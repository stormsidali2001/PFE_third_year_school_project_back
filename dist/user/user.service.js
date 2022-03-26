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
const announcement_entity_1 = require("../core/entities/announcement.entity");
const invitation_entity_1 = require("../core/entities/invitation.entity");
const Notification_entity_1 = require("../core/entities/Notification.entity");
const student_entity_1 = require("../core/entities/student.entity");
const survey_entity_1 = require("../core/entities/survey.entity");
const survey_option_entity_1 = require("../core/entities/survey.option.entity");
const team_chat_message_entity_1 = require("../core/entities/team.chat.message.entity");
const team_entity_1 = require("../core/entities/team.entity");
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
        if (senderId === recieverId) {
            common_1.Logger.error("you can't send a team invitation to your self !!", 'UserService/sendATeamInvitation');
            throw new common_1.HttpException("you can't send a team invitation to your self !!", common_1.HttpStatus.BAD_REQUEST);
        }
        const manager = (0, typeorm_1.getManager)();
        try {
            const sender = await manager.getRepository(student_entity_1.StudentEntity).findOne({ id: senderId }, { relations: ['team', 'sentInvitations'] });
            if (!sender) {
                common_1.Logger.error("sender not found", 'UserService/sendATeamInvitation');
                throw new common_1.HttpException("sender not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const reciever = await manager.getRepository(student_entity_1.StudentEntity).findOne({ id: recieverId }, { relations: ['team', 'sentInvitations'] });
            if (!reciever) {
                common_1.Logger.error("reciever not found", 'UserService/sendATeamInvitation');
                throw new common_1.HttpException("receiver not found", common_1.HttpStatus.BAD_REQUEST);
            }
            if (reciever.team) {
                common_1.Logger.error("le destinataire doit etre sans equipe.", 'UserService/sendATeamInvitation');
                throw new common_1.HttpException("le destinataire doit etre sans equipe.", common_1.HttpStatus.BAD_REQUEST);
            }
            const invitationsRepository = manager.getRepository(invitation_entity_1.InvitationEntity);
            const invitation = invitationsRepository.create({ description, sender, reciever });
            await invitationsRepository.save(invitation);
            return JSON.stringify({ sender, reciever, description });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/sendATeamInvitation');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async acceptRefuseTeamInvitation(invitationId, accepted) {
        const manager = (0, typeorm_1.getManager)();
        const invitationsRepository = manager.getRepository(invitation_entity_1.InvitationEntity);
        let invitation;
        try {
            invitation = await invitationsRepository.findOne({ id: invitationId }, {
                relations: ['reciever', 'sender', 'sender.team', 'reciever.team']
            });
            if (!invitation) {
                common_1.Logger.error("invitation not found", 'UserService/getAcceptRefuseTeamInvitation');
                throw new common_1.HttpException("invitation not found", common_1.HttpStatus.BAD_REQUEST);
            }
            if (!accepted) {
                await invitationsRepository.delete({ id: invitation.id });
                this._sendNotfication(invitation.sender.id, `${invitation.reciever.firstName} ${invitation.reciever.lastName} refused your invitation `);
                return "the invitation has been refused";
            }
            const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            let newTeamCreated = false;
            if (!invitation.sender.team) {
                const teamLength = await teamRepository.count();
                newTeamCreated = true;
                const newTeam = teamRepository.create({ nickName: 'team' + teamLength, teamLeader: invitation.sender });
                await teamRepository.save(newTeam);
                invitation.reciever.team = newTeam;
                invitation.sender.team = newTeam;
                await studentRepository.save(invitation.reciever);
                await studentRepository.save(invitation.sender);
            }
            else {
                invitation.reciever.team = invitation.sender.team;
                await studentRepository.save(invitation.reciever);
            }
            await invitationsRepository.delete({ id: invitation.id });
            let outputMessage = `invitation has been accepted`;
            if (newTeamCreated) {
                outputMessage += `\n team: ${invitation.sender.team.nickName} was created.`;
                await this._sendTeamNotfication(invitation.sender.team.id, `you are now in the new team: ${invitation.sender.team.nickName} .`);
            }
            else {
                outputMessage += `\n ${invitation.reciever.firstName + ' ' + invitation.reciever.lastName} joined the ${invitation.reciever.team.nickName}.`;
                await this._sendTeamNotfication(invitation.sender.team.id, `${invitation.reciever.firstName} ${invitation.reciever.lastName} joined your team`, invitation.reciever.id, `you joined the team: ${invitation.sender.team.nickName} successfully...`);
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
                common_1.Logger.error(`invitations related to: ${student.firstName + ' ' + student.lastName}`, 'UserService/getInvitations');
                throw new common_1.HttpException(`invitations related to: ${student.firstName + ' ' + student.lastName}`, common_1.HttpStatus.BAD_REQUEST);
            }
            return invitations;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getInvitations');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async _sendNotfication(studentId, description) {
        const manager = (0, typeorm_1.getManager)();
        const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
        const student = await studentRepository.findOne({ id: studentId });
        if (!student) {
            common_1.Logger.error("student not found", 'UserService/sendNotfication');
            throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
        }
        const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
        const notification = notificationRepository.create({ description, student, seen: false });
        await notificationRepository.save(notification);
        return `notification sent with success to: ${student.firstName + ' ' + student.lastName}`;
    }
    async _sendTeamNotfication(teamId, description, expectStudentId, expectMessage) {
        const manager = (0, typeorm_1.getManager)();
        const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
        const team = await teamRepository.findOne({ id: teamId }, { relations: ['students'] });
        if (!team) {
            common_1.Logger.error("team not found", 'UserService/sendTeamNotfication');
            throw new common_1.HttpException("team not found", common_1.HttpStatus.BAD_REQUEST);
        }
        const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
        for (let student of team.students) {
            if (expectStudentId && student.id === expectStudentId) {
                if (expectMessage) {
                    const notification = notificationRepository.create({ description: expectMessage, student, seen: false });
                    await notificationRepository.save(notification);
                }
                continue;
            }
            const notification = notificationRepository.create({ description, student, seen: false });
            await notificationRepository.save(notification);
        }
        return `notification sent with success to team: ${team.nickName} members`;
    }
    async getNotifications(studentId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.findOne({ id: studentId });
            if (!student) {
                common_1.Logger.error("student not found", 'UserService/getNotifications');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
            const notifications = await notificationRepository.find({ student: student });
            return notifications;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getNotifications');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createTeamAnnouncement(studentId, teamId, title, description) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
            const team = await teamRepository.findOne({ id: teamId }, { relations: ['teamLeader'] });
            if (!team) {
                common_1.Logger.error("team not found", 'UserService/createTeamAnnouncement');
                throw new common_1.HttpException("team not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.findOne({ id: studentId });
            if (!student) {
                common_1.Logger.error("student not found", 'UserService/createTeamAnnouncement');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            if (team.teamLeader.id !== student.id) {
                common_1.Logger.error("student is not the team leader", 'UserService/createTeamAnnouncement');
                throw new common_1.HttpException("student is not the team leader", common_1.HttpStatus.BAD_REQUEST);
            }
            const announcementRepository = manager.getRepository(announcement_entity_1.AnnouncementEntity);
            const announcement = announcementRepository.create({ title, description, team });
            await announcementRepository.save(announcement);
            return `announcement sent with success to team: ${team.nickName} members`;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createTeamAnnouncement');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendTeamChatMessage(studentId, teamId, message) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
            const team = await teamRepository.findOne({ id: teamId });
            if (!team) {
                common_1.Logger.error("team not found", 'UserService/sendTeamChatMessage');
                throw new common_1.HttpException("team not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.findOne({ id: studentId });
            if (!student) {
                common_1.Logger.error("student not found", 'UserService/sendTeamChatMessage');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const chatRepository = manager.getRepository(team_chat_message_entity_1.TeamChatMessageEntity);
            const chat = chatRepository.create({ message, team, owner: student });
            await chatRepository.save(chat);
            return `message sent with success to team: ${team.nickName} members`;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/sendTeamChatMessage');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createSurvey(studentId, survey) {
        const { title, description, period, teamId, options, close } = survey;
        try {
            const manager = (0, typeorm_1.getManager)();
            const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
            const team = await teamRepository.findOne({ id: teamId }, { relations: ['teamLeader'] });
            if (!team) {
                common_1.Logger.error("team not found", 'UserService/createSurvey');
                throw new common_1.HttpException("team not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.findOne({ id: studentId });
            if (!student) {
                common_1.Logger.error("student not found", 'UserService/createSurvey');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            if (team.teamLeader.id !== student.id) {
                common_1.Logger.error("student is not the team leader", 'UserService/createSurvey');
                throw new common_1.HttpException("student is not the team leader", common_1.HttpStatus.BAD_REQUEST);
            }
            const surveyRepository = manager.getRepository(survey_entity_1.SurveyEntity);
            const surveyOptionRepository = manager.getRepository(survey_option_entity_1.SurveyOptionEntity);
            const survey = surveyRepository.create({ title, description, period, team, close });
            await surveyRepository.save(survey);
            for (let key in options) {
                const { description } = options[key];
                const surveyOption = surveyOptionRepository.create({ description, survey });
                await surveyOptionRepository.save(surveyOption);
            }
            this._sendTeamNotfication(team.id, `a new survey has been created a survey with title: ${title}`);
            return `survey sent with success to team: ${team.nickName} members`;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createSurvey');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map