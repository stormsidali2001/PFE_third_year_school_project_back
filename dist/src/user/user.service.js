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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const announcement_entity_1 = require("../core/entities/announcement.entity");
const invitation_entity_1 = require("../core/entities/invitation.entity");
const Notification_entity_1 = require("../core/entities/Notification.entity");
const student_entity_1 = require("../core/entities/student.entity");
const survey_entity_1 = require("../core/entities/survey.entity");
const survey_option_entity_1 = require("../core/entities/survey.option.entity");
const survey_participant_entity_1 = require("../core/entities/survey.participant.entity");
const team_chat_message_entity_1 = require("../core/entities/team.chat.message.entity");
const team_entity_1 = require("../core/entities/team.entity");
const user_entity_1 = require("../core/entities/user.entity");
const typeorm_1 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const meet_entity_1 = require("../core/entities/meet.entity");
const socket_service_1 = require("../socket/socket.service");
const announcement_document_entity_1 = require("../core/entities/announcement.document.entity");
const team_document_entity_1 = require("../core/entities/team.document.entity");
const fs = require("fs");
const path = require("path");
const teacher_entity_1 = require("../core/entities/teacher.entity");
const admin_entity_1 = require("../core/entities/admin.entity");
const entreprise_entity_1 = require("../core/entities/entreprise.entity");
const config_entity_1 = require("../core/entities/config.entity");
const theme_entity_1 = require("../core/entities/theme.entity");
const theme_document_entity_1 = require("../core/entities/theme.document.entity");
const promotion_entity_1 = require("../core/entities/promotion.entity");
const wish_entity_1 = require("../core/entities/wish.entity");
const encadrement_entity_1 = require("../core/entities/encadrement.entity");
const responsible_entity_1 = require("../core/entities/responsible.entity");
const document_types_entity_1 = require("../core/entities/document-types.entity");
const commit_document_entity_1 = require("../core/entities/commit.document.entity");
const commit_entity_1 = require("../core/entities/commit.entity");
let UserService = class UserService {
    constructor(schedulerRegistry, socketService) {
        this.schedulerRegistry = schedulerRegistry;
        this.socketService = socketService;
    }
    async getUserInfo(userId) {
        const manager = (0, typeorm_1.getManager)();
        const userRepository = manager.getRepository(user_entity_1.UserEntity);
        try {
            const user = await userRepository.createQueryBuilder('user')
                .where('user.id = :userId', { userId })
                .getOne();
            if (!user) {
                common_1.Logger.log("user not found", "userService/getUserInfo");
                throw new common_1.HttpException("user not found", common_1.HttpStatus.FORBIDDEN);
            }
            let entity;
            if (user.userType === user_entity_1.UserType.STUDENT) {
                entity = await (0, typeorm_1.getManager)().getRepository(student_entity_1.StudentEntity).createQueryBuilder('student')
                    .where('student.userId = :userId', { userId })
                    .leftJoinAndSelect('student.team', 'team')
                    .leftJoinAndSelect('team.teamLeader', 'teamLeader')
                    .leftJoinAndSelect('student.promotion', 'promotion')
                    .getOne();
            }
            else if (user.userType === user_entity_1.UserType.ADMIN) {
                entity = await (0, typeorm_1.getManager)().getRepository(admin_entity_1.AdminEntity).createQueryBuilder('admin')
                    .where('admin.userId = :userId', { userId: user.id })
                    .getOne();
            }
            else if (user.userType === user_entity_1.UserType.TEACHER) {
                entity = await (0, typeorm_1.getManager)().getRepository(teacher_entity_1.TeacherEntity).createQueryBuilder('teacher')
                    .where('teacher.userId = :userId', { userId: user.id })
                    .getOne();
            }
            else if (user.userType === user_entity_1.UserType.ENTERPRISE) {
            }
            const responseObj = {
                userType: user.userType,
                email: user.email,
                [`${user.userType}`]: Object.assign({}, entity)
            };
            return responseObj;
        }
        catch (err) {
            common_1.Logger.error(err, "userService/getUserInfo");
            throw new common_1.HttpException(err, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
            let outputMessage = `invitation has been accepted`;
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                const invitationsRepository = manager.getRepository(invitation_entity_1.InvitationEntity);
                invitation = await invitationsRepository
                    .createQueryBuilder('invitation')
                    .leftJoinAndSelect('invitation.sender', 'sender')
                    .leftJoinAndSelect('invitation.reciever', 'reciever')
                    .leftJoinAndSelect('sender.team', 'steam')
                    .leftJoinAndSelect('reciever.team', 'rteam')
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
                    this._sendNotficationStudent(invitation.sender.id, `${invitation.reciever.firstName} ${invitation.reciever.lastName} refused your invitation `);
                    return "the invitation has been refused";
                }
                const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
                const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
                if (!invitation.sender.team) {
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
                    await studentRepository.save(invitation.reciever);
                }
                await invitationsRepository.createQueryBuilder()
                    .delete()
                    .where('invitation.recieverId = :recieverId', { recieverId: invitation.reciever.id })
                    .execute();
            });
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
    async _sendNotficationStudent(studentId, description) {
        const manager = (0, typeorm_1.getManager)();
        const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
        const student = await studentRepository.createQueryBuilder('student')
            .where('student.id = :studentId', { studentId })
            .leftJoinAndSelect('student.user', 'user')
            .getOne();
        if (!student) {
            common_1.Logger.error("student not found", 'UserService/sendNotfication');
            throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
        }
        const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
        const notification = notificationRepository.create({ description, user: student.user, seen: false });
        await notificationRepository.save(notification);
        const socket = this.socketService.socket;
        socket.to(student.user.id).emit("new_notification", notification);
        return `notification sent with success to: ${student.firstName + ' ' + student.lastName}`;
    }
    async _sendTeamNotfication(teamId, description, expectStudentId, expectMessage) {
        const manager = (0, typeorm_1.getManager)();
        const teamRepository = manager.getRepository(team_entity_1.TeamEntity);
        const team = await teamRepository.createQueryBuilder('team')
            .where('team.id = :teamId', { teamId })
            .leftJoinAndSelect('team.students', 'student')
            .leftJoinAndSelect('student.user', 'user')
            .getOne();
        if (!team) {
            common_1.Logger.error("the student is not a member in a team", 'UserService/sendTeamNotfication');
            throw new common_1.HttpException("the student is not a member in a team", common_1.HttpStatus.BAD_REQUEST);
        }
        const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
        const notifications = [];
        for (let student of team.students) {
            if (expectStudentId && student.id === expectStudentId) {
                if (expectMessage) {
                    const notification = notificationRepository.create({ description: expectMessage, user: student.user, seen: false });
                    notifications.push(notification);
                }
                continue;
            }
            const notification = notificationRepository.create({ description, user: student.user, seen: false });
            notifications.push(notification);
        }
        await notificationRepository.save(notifications);
        const socket = this.socketService.socket;
        notifications.forEach(nf => {
            socket.to(nf.user).emit("new_notification", nf);
        });
        return `notification sent with success to team: ${team.nickName} members`;
    }
    async _sendNotfication(userId, description) {
        const manager = (0, typeorm_1.getManager)();
        const userRepository = manager.getRepository(user_entity_1.UserEntity);
        const user = await userRepository.createQueryBuilder('user')
            .where('user.id = :userId', { userId })
            .getOne();
        if (!user) {
            common_1.Logger.error("user not found", 'UserService/sendNotfication');
            throw new common_1.HttpException("user not found", common_1.HttpStatus.BAD_REQUEST);
        }
        const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
        const notification = notificationRepository.create({ description, user, seen: false });
        await notificationRepository.save(notification);
        const socket = this.socketService.socket;
        common_1.Logger.error(`emit to ${userId}  event new_notification`, "debugggggg");
        socket.to(userId).emit("new_notification", notification);
        return `notification sent with `;
    }
    async getLastNotifications(userId, number = undefined) {
        try {
            const manager = (0, typeorm_1.getManager)();
            common_1.Logger.error(`notifications ${userId}`, 'UserService/getNotifications');
            const notificationRepository = manager.getRepository(Notification_entity_1.NotificationEntity);
            const notifications = await notificationRepository.createQueryBuilder('notification')
                .innerJoin('notification.user', 'user')
                .where('user.id = :userId', { userId })
                .orderBy('notification.createdAt', "DESC")
                .getMany();
            const totalNotificationCount = await notificationRepository.createQueryBuilder('notification')
                .innerJoin('notification.user', 'user')
                .where('user.id = :userId', { userId })
                .getCount();
            return { notifications, totalNotificationCount };
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getNotifications');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createTeamAnnouncement(userId, title, description, documents) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const student = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .where('student.userId = :userId', { userId })
                .innerJoinAndSelect('student.team', 'team')
                .innerJoinAndSelect('team.teamLeader', 'teamLeader')
                .getOne();
            if (!student) {
                common_1.Logger.error("student not found", 'UserService/createTeamAnnouncement');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            common_1.Logger.error(title, "*********");
            const announcementRepository = manager.getRepository(announcement_entity_1.AnnouncementEntity);
            const announcement = announcementRepository.create({ title, description, team: student.team });
            await announcementRepository
                .createQueryBuilder('announcement')
                .insert()
                .values(announcement)
                .execute();
            const announcementDocumentRepository = manager.getRepository(announcement_document_entity_1.AnnouncementDocumentEntity);
            const announcementDocs = [];
            documents.forEach(doc => {
                const announcementDoc = announcementDocumentRepository.create({ name: doc.name, url: doc.url, announcement });
                announcementDocs.push(announcementDoc);
            });
            await manager.getRepository(announcement_document_entity_1.AnnouncementDocumentEntity).createQueryBuilder('docs')
                .insert()
                .values(announcementDocs)
                .execute();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createTeamAnnouncement');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAnnouncement(userId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const Announcements = await manager.getRepository(announcement_entity_1.AnnouncementEntity)
                .createQueryBuilder('announcement')
                .innerJoinAndSelect('announcement.team', 'team')
                .innerJoinAndSelect('team.students', 'student')
                .where('student.userId = :userId', { userId })
                .leftJoinAndSelect('announcement.documents', 'documents')
                .orderBy('createdAt', 'DESC')
                .getMany();
            const response = Announcements.map(({ id, title, description, documents }) => {
                return {
                    id,
                    title,
                    description,
                    documents
                };
            });
            return response;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getAnnouncement');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
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
    async createSurvey(userId, survey) {
        const { title, description, options } = survey;
        let { period } = survey;
        if (Number.isNaN(period)) {
            common_1.Logger.error("period is not a number", 'UserService/createSurvey');
            throw new common_1.HttpException("period is not a number", common_1.HttpStatus.BAD_REQUEST);
        }
        if (period < 1 && period > 7) {
            common_1.Logger.error("period must be between 1 and 7", 'UserService/createSurvey');
            throw new common_1.HttpException("period must be between 1 and 7", common_1.HttpStatus.BAD_REQUEST);
        }
        period = period * 24 * 60 * 60 * 1000;
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.
                createQueryBuilder('student')
                .where('student.userId = :userId', { userId })
                .innerJoinAndSelect('student.team', 'team')
                .innerJoinAndSelect('team.teamLeader', 'teamLeader')
                .getOne();
            if (!student) {
                common_1.Logger.error("student | team   not found | student is not the teamLeader", 'UserService/createSurvey');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const surveyRepository = manager.getRepository(survey_entity_1.SurveyEntity);
            const surveyOptionRepository = manager.getRepository(survey_option_entity_1.SurveyOptionEntity);
            const survey = surveyRepository.create({ title, description, period, team: student.team, close: false });
            const surveyOptions = [];
            await surveyRepository.save(survey);
            for (let key in options) {
                const { description } = options[key];
                const surveyOption = surveyOptionRepository.create({ description, survey });
                surveyOptions.push(surveyOption);
            }
            await surveyOptionRepository.save(surveyOptions);
            const surveyData = await surveyRepository.findOne({ id: survey.id });
            this._sendTeamNotfication(student.team.id, `a new survey has been created a survey with title: ${title}`);
            const job = new cron_1.CronJob(new Date(new Date(surveyData.createdAt).getTime() + period), () => {
                common_1.Logger.warn("survey period has ended", 'UserService/createSurvey');
                surveyRepository.update({ id: surveyData.id }, { close: true });
                this._sendTeamNotfication(student.team.id, `the survey with title: ${title}  ended`);
            });
            this.schedulerRegistry.addCronJob(`cron_Job_surveyEnd_${surveyData.id}`, job);
            job.start();
            return `survey sent with success to team: ${student.team.nickName} members`;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createSurvey');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async submitSurveyAnswer(userId, surveyId, optionId, argument) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.createQueryBuilder('student')
                .innerJoinAndSelect('student.team', 'team')
                .innerJoinAndSelect('team.surveys', 'surveys')
                .where('surveys.id = :surveyId', { surveyId })
                .innerJoinAndSelect('surveys.options', 'options')
                .andWhere('student.userId = :userId', { userId })
                .andWhere('options.id = :optionId', { optionId })
                .getOne();
            if (!student) {
                common_1.Logger.error("survey or student or option not found", 'UserService/submitSurveyAnswer');
                throw new common_1.HttpException("survey or student or option not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const surveyParticipantRepository = manager.getRepository(survey_participant_entity_1.SurveyParticipantEntity);
            const existingSurveyParticipant = await surveyParticipantRepository.createQueryBuilder('surveyParticipant')
                .innerJoin('surveyParticipant.survey', 'survey')
                .innerJoin('surveyParticipant.student', 'student')
                .innerJoinAndSelect('surveyParticipant.answer', 'answer')
                .andWhere('student.userId = :userId', { userId })
                .andWhere('survey.id = :surveyId', { surveyId })
                .getOne();
            const surveyParticipant = surveyParticipantRepository.create({ survey: student.team.surveys[0], student: student, answer: student.team.surveys[0].options[0], argument });
            if (!existingSurveyParticipant) {
                await surveyParticipantRepository.save(surveyParticipant);
                return "survey answered succesfully";
            }
            if (surveyParticipant.answer.id === existingSurveyParticipant.answer.id && surveyParticipant.argument === argument) {
                common_1.Logger.error("you've already answered to the survey using that option or by providing the same argument", 'UserService/submitSurvey');
                throw new common_1.HttpException("you've already answered to the survey using that option", common_1.HttpStatus.BAD_REQUEST);
            }
            await surveyParticipantRepository.update({ id: existingSurveyParticipant.id }, surveyParticipant);
            return "answer updated succesfully";
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/submitSurvey');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSurveys(userId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const surveyRepo = manager.getRepository(survey_entity_1.SurveyEntity);
            const surveys = await surveyRepo.createQueryBuilder('survey')
                .leftJoin('survey.team', 'team')
                .leftJoin('team.students', 'student')
                .where('student.userId = :userId', { userId })
                .leftJoinAndSelect('survey.participants', 'participants')
                .orderBy('survey.createdAt', 'DESC')
                .getMany();
            return surveys;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getSurveys');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSurvey(userId, surveyId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const surveyRepo = manager.getRepository(survey_entity_1.SurveyEntity);
            const survey = await surveyRepo.createQueryBuilder('survey')
                .where('survey.id = :surveyId', { surveyId })
                .leftJoin('survey.team', 'team')
                .leftJoin('team.students', 'student')
                .andWhere('student.userId = :userId', { userId })
                .leftJoinAndSelect('survey.participants', 'participant', 'participant.student.id = student.id')
                .leftJoinAndSelect('participant.answer', 'answer')
                .leftJoinAndSelect('survey.options', 'options')
                .loadRelationCountAndMap('options.answersCount', 'options.participations')
                .leftJoinAndSelect("participant.student", 'participantStudent', 'participantStudent.id = student.id')
                .getOne();
            const response = Object.assign({}, survey);
            const participants = response.participants;
            delete response.participants;
            response['argument'] = (participants === null || participants === void 0 ? void 0 : participants.length) >= 1 ? participants[0].argument : null;
            response['answer'] = (participants === null || participants === void 0 ? void 0 : participants.length) >= 1 ? participants[0].answer : '';
            return response;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getSurvey');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSurveyParticipantsArguments(userId, surveyId, optionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            return await manager.getRepository(survey_participant_entity_1.SurveyParticipantEntity)
                .createQueryBuilder('participant')
                .where(qb => {
                const subQuery = qb.subQuery()
                    .select('survey.id')
                    .from(student_entity_1.StudentEntity, 'student')
                    .where('student.userId = :userId', { userId })
                    .leftJoin('student.team', 'team')
                    .leftJoin('team.surveys', 'survey')
                    .andWhere('survey.id = :surveyId', { surveyId })
                    .getQuery();
                return 'participant.surveyId IN ' + subQuery;
            })
                .andWhere('participant.answerId = :optionId', { optionId })
                .leftJoinAndSelect('participant.student', 'student')
                .getMany();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getSurveyParticipantsArguments');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createNormalTeamMeet(studentId, meet) {
        try {
            const { title, description, weekDay, hour, minute, second } = meet;
            if (Number.isNaN(Number(weekDay)) || Number.isNaN(Number(hour)) || Number.isNaN(Number(minute)) || Number.isNaN(Number(second))) {
                common_1.Logger.error("invalid time", 'UserService/createMeet');
                throw new common_1.HttpException("invalid time", common_1.HttpStatus.BAD_REQUEST);
            }
            if (weekDay < 0 || weekDay > 6) {
                common_1.Logger.error("invalid weekDay", 'UserService/createMeet');
                throw new common_1.HttpException("invalid weekDay", common_1.HttpStatus.BAD_REQUEST);
            }
            if (hour < 0 || hour > 23) {
                common_1.Logger.error("invalid hour", 'UserService/createMeet');
                throw new common_1.HttpException("invalid hour", common_1.HttpStatus.BAD_REQUEST);
            }
            if (minute < 0 || minute > 59) {
                common_1.Logger.error("invalid minute", 'UserService/createMeet');
                throw new common_1.HttpException("invalid minute", common_1.HttpStatus.BAD_REQUEST);
            }
            if (second < 0 || second > 59) {
                common_1.Logger.error("invalid second", 'UserService/createMeet');
                throw new common_1.HttpException("invalid second", common_1.HttpStatus.BAD_REQUEST);
            }
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.createQueryBuilder('student')
                .innerJoinAndSelect('student.team', 'team')
                .innerJoin('team.teamLeader', 'teamLeader')
                .where('student.id = :studentId', { studentId })
                .getOne();
            if (!student) {
                common_1.Logger.error("not found", 'UserService/createMeet');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const meetRepository = manager.getRepository(meet_entity_1.MeetEntity);
            const meetEntity = meetRepository.create({ title, description, weekDay, hour, minute, second, team: student.team, type: meet_entity_1.MeetType.NORMAL });
            await meetRepository.save(meetEntity);
            this._sendTeamNotfication(student.team.id, `new normal meet: '${title}' every week on ${weekDay} at ${hour}:${minute}:${second}`);
            const cronExpression = `${second} ${minute} ${hour - 1} * * ${weekDay}`;
            const job = new cron_1.CronJob(cronExpression, async () => {
                this._sendTeamNotfication(student.team.id, `the normal meet with title: '${title}' will be starting after a hour`);
            });
            this.schedulerRegistry.addCronJob(`cron_Job_normal_meet_${meetEntity.id}`, job);
            job.start();
            return `meet sent with success to team: ${student.team.nickName} members`;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createMeet');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createUrgentTeamMeet(studentId, meet) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.createQueryBuilder('student')
                .innerJoinAndSelect('student.team', 'team')
                .innerJoin('team.teamLeader', 'teamLeader')
                .where('student.id = :studentId', { studentId })
                .getOne();
            if (!student) {
                common_1.Logger.error("not found", 'UserService/createMeet');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const { title, description, date } = meet;
            const meetRepository = manager.getRepository(meet_entity_1.MeetEntity);
            const meetEntity = meetRepository.create({ title, description, date, team: student.team, type: meet_entity_1.MeetType.URGENTE });
            await meetRepository.save(meetEntity);
            this._sendTeamNotfication(student.team.id, `new urgent meet: '${title}' at ${date}`);
            const job = new cron_1.CronJob(new Date(meetEntity.date.getTime() - 1 * 60 * 60 * 1000), async () => {
                this._sendTeamNotfication(student.team.id, `the urgent meet with title: '${title}' will be starting at : ${date}`);
            });
            this.schedulerRegistry.addCronJob(`cron_Job_urgent_meet_${meetEntity.id}`, job);
            job.start();
            return "urgent meet created";
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createMeet');
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
    async addTeamDocument(userId, name, url, description, typeDocId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const team = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .leftJoinAndSelect('team.students', 'student')
                .where('student.userId = :userId', { userId })
                .getOne();
            if (!team) {
                common_1.Logger.error("user not found", 'UserService/addTeamDocument');
                throw new common_1.HttpException("user not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const type = await manager.getRepository(document_types_entity_1.DocumentTypeEntity)
                .createQueryBuilder('type')
                .where('type.id = :typeDocId', { typeDocId })
                .getOne();
            if (!type) {
                common_1.Logger.error("type not found", 'UserService/addTeamDocument');
                throw new common_1.HttpException("type not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const teamDocumentRepository = manager.getRepository(team_document_entity_1.TeamDocumentEntity);
            const teamDocument = teamDocumentRepository.create({ name, url, team, description, owner: team.students[0], type });
            manager.getRepository(team_document_entity_1.TeamDocumentEntity)
                .createQueryBuilder('teamDoc')
                .insert()
                .values(teamDocument)
                .execute();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/addTeamDocument');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeamDocuments(userId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const team = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .leftJoinAndSelect('team.students', 'student')
                .where('student.userId = :userId', { userId })
                .leftJoinAndSelect('team.documents', 'document')
                .leftJoinAndSelect('document.owner', 'owner')
                .leftJoinAndSelect('document.type', 'type')
                .getOne();
            if (!team) {
                common_1.Logger.error("team not found", 'UserService/getTeamDocuments');
                throw new common_1.HttpException("user not found", common_1.HttpStatus.BAD_REQUEST);
            }
            return team.documents;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeamDocuments');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteTeamDocs(userId, docsIds) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const team = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .leftJoinAndSelect('team.students', 'student')
                .where('student.userId = :userId', { userId })
                .leftJoinAndSelect('team.documents', 'document')
                .leftJoinAndSelect('document.owner', 'owner')
                .getOne();
            if (!team) {
                common_1.Logger.error("team not found", 'UserService/deleteTeamDocs');
                throw new common_1.HttpException("user not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const documents = team.documents.filter(doc => docsIds.some(id => id === doc.id));
            if (documents.length != docsIds.length) {
                common_1.Logger.error("wrong docs ids", 'UserService/deleteTeamDocs');
                throw new common_1.HttpException("wrong docs ids", common_1.HttpStatus.BAD_REQUEST);
            }
            documents.forEach(doc => {
                fs.unlink(path.resolve(doc.url), (err) => {
                    if (err) {
                        common_1.Logger.error(`failed to delete the document with id: ${doc.id} and url: ${doc.url}`, 'UserService/deleteTeamDocs ', err);
                    }
                });
            });
            await manager.getRepository(team_document_entity_1.TeamDocumentEntity)
                .createQueryBuilder('documents')
                .delete()
                .where('team_document.id IN (:...docsIds)', { docsIds })
                .execute();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/deleteTeamDocs');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async commitDocs(userId, title, description, docsIds) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const student = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .where('student.userId = :userId', { userId })
                .innerJoinAndSelect('student.team', 'team')
                .innerJoin('team.teamLeader', 'teamLeader')
                .andWhere('teamLeader.id = student.id')
                .getOne();
            if (!student) {
                common_1.Logger.error("permission denied", 'UserService/commitDocs');
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const responsibles = await manager.getRepository(responsible_entity_1.ResponsibleEntity)
                .createQueryBuilder('res')
                .where('res.teamId = :teamId', { teamId: student.team.id })
                .innerJoinAndSelect('res.team', 'team')
                .innerJoinAndSelect('team.givenTheme', 'givenTheme')
                .innerJoinAndSelect('givenTheme.encadrement', 'encadrement')
                .andWhere('encadrement.teacherId = res.teacherId')
                .getMany();
            if (responsibles.length === 0) {
                common_1.Logger.error("aucun ensignant encadrant le theme donnee a l'equipe est responsable de cette derniere ", 'UserService/commitDocs');
                throw new common_1.HttpException("aucun ensignant encadrant le theme donnee a l'equipe est responsable de cette derniere ", common_1.HttpStatus.BAD_REQUEST);
            }
            const teamDocs = await manager.getRepository(team_document_entity_1.TeamDocumentEntity)
                .createQueryBuilder('doc')
                .where('doc.id in (:...docsIds)', { docsIds })
                .andWhere('doc.teamId = :teamId', { teamId: student.team.id })
                .getMany();
            if (teamDocs.length !== docsIds.length) {
                common_1.Logger.error("wrong doc ids", 'UserService/commitDocs');
                throw new common_1.HttpException("wrong doc ids", common_1.HttpStatus.BAD_REQUEST);
            }
            const commit = manager.getRepository(commit_entity_1.CommitEntity)
                .create({ title, description });
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                await manager.getRepository(commit_entity_1.CommitEntity).save(commit);
                const docsToCommit = [];
                teamDocs.forEach(teamDoc => {
                    const url = teamDoc.url + Date.now();
                    fs.copyFile(path.resolve(teamDoc.url), path.resolve(url), (err) => {
                        if (err) {
                            common_1.Logger.error(`failed to copy the document with id: ${teamDoc.id} and url: ${teamDoc.url}`, 'UserService/commitDocs ');
                            console.log(err);
                        }
                    });
                    const doc = manager.getRepository(commit_document_entity_1.CommitDocumentEntity).create({ name: teamDoc.name, url, type: teamDoc.type, commit });
                    docsToCommit.push(doc);
                });
                await manager.getRepository(commit_document_entity_1.CommitDocumentEntity).save(docsToCommit);
            });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/commitDocs');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getStudents() {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const students = await studentRepository.createQueryBuilder('students')
                .leftJoinAndSelect('students.promotion', 'promotion')
                .getMany();
            return students;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getStudents');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteStudent(studentId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            await studentRepository.createQueryBuilder('students')
                .delete()
                .where('student.id = :studentId', { studentId }).execute();
            return "deleted!!";
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/deleteStudent');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async editStudent(studentId, data) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            await studentRepository.createQueryBuilder('students')
                .update()
                .set(data)
                .where('students.id = :studentId', { studentId }).execute();
            return "updated !!";
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/editStudent');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeachers() {
        try {
            const manager = (0, typeorm_1.getManager)();
            const teacherRepository = manager.getRepository(teacher_entity_1.TeacherEntity);
            const teachers = await teacherRepository.createQueryBuilder('teachers')
                .getMany();
            return teachers;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeachers');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteTeacher(teacherId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const teacherRepository = manager.getRepository(teacher_entity_1.TeacherEntity);
            await teacherRepository.createQueryBuilder()
                .delete()
                .where('teacher.id = :teacherId', { teacherId }).execute();
            return "deleted!!";
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/deleteTeacher');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async editTeacher(teacherId, data) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const teacherRepository = manager.getRepository(teacher_entity_1.TeacherEntity);
            await teacherRepository.createQueryBuilder('teachers')
                .update()
                .set(data)
                .where('teachers.id = :teacherId', { teacherId }).execute();
            return "updated !!";
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/editTeacher');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createThemeSuggestion(userId, title, description, documents, promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = await manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where('user.id = :userId', { userId })
                .getOne();
            if (!user) {
                common_1.Logger.error("user not found", 'UserService/createThemeSuggestion');
                throw new common_1.HttpException("user not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const { userType } = user;
            if (userType !== user_entity_1.UserType.TEACHER && userType !== user_entity_1.UserType.ENTERPRISE) {
                common_1.Logger.error("you need to be either a teacher or an entreprise to submit a theme suggestion ", 'UserService/createThemeSuggestion');
                throw new common_1.HttpException("you need to be either a teacher or an entreprise to submit a theme suggestion  ", common_1.HttpStatus.BAD_REQUEST);
            }
            const promotion = await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder('promotion')
                .where('promotion.id = :promotionId', { promotionId })
                .getOne();
            if (!promotion) {
                common_1.Logger.error("promotion not found", 'UserService/createThemeSuggestion');
                throw new common_1.HttpException("promotion not found", common_1.HttpStatus.BAD_REQUEST);
            }
            let themeSuggestion;
            const themeRepository = manager.getRepository(theme_entity_1.ThemeEntity);
            if (userType === user_entity_1.UserType.TEACHER) {
                const teacher = await manager.getRepository(teacher_entity_1.TeacherEntity)
                    .createQueryBuilder('teacher')
                    .where('teacher.userId = :userId', { userId })
                    .getOne();
                themeSuggestion = themeRepository.create({ title, description, suggestedByTeacher: teacher, promotion });
            }
            else if (userType === user_entity_1.UserType.ENTERPRISE) {
                const entreprise = await manager.getRepository(entreprise_entity_1.EntrepriseEntity)
                    .createQueryBuilder('entrprise')
                    .where('entrprise.userId = :userId', { userId })
                    .getOne();
                themeSuggestion = themeRepository.create({ title, description, suggestedByEntreprise: entreprise, promotion });
            }
            await themeRepository
                .createQueryBuilder()
                .insert()
                .values(themeSuggestion)
                .execute();
            const themeDocumentRepository = manager.getRepository(theme_document_entity_1.ThemeDocumentEntity);
            const themeSuggestionsDocs = [];
            documents.forEach(doc => {
                const themeSugDoc = themeDocumentRepository.create({ name: doc.name, url: doc.url, theme: themeSuggestion });
                themeSuggestionsDocs.push(themeSugDoc);
            });
            await themeDocumentRepository.createQueryBuilder()
                .insert()
                .values(themeSuggestionsDocs)
                .execute();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThemeSuggestions(promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const themeSuggestions = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where('theme.promotionId = :promotionId', { promotionId })
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher', 'theme.suggestedByTeacher IS NOT NULL')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise', 'theme.suggestedByEntreprise IS NOT NULL')
                .getMany();
            return themeSuggestions;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getThemeSuggestions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllThemeSuggestions() {
        try {
            const manager = (0, typeorm_1.getManager)();
            const themeSuggestions = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher', 'theme.suggestedByTeacher IS NOT NULL')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise', 'theme.suggestedByEntreprise IS NOT NULL')
                .leftJoinAndSelect('theme.promotion', 'promotion')
                .getMany();
            return themeSuggestions;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getAllThemeSuggestions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThemeSuggestion(themeId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const themeSuggestion = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where("theme.id = :themeId", { themeId })
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise')
                .leftJoinAndSelect('theme.documents', 'documents')
                .leftJoinAndSelect('theme.promotion', 'promotion')
                .getOne();
            return themeSuggestion;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validateThemeSuggestion(userId, themeId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = await manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where('user.userType = :userType', { userType: user_entity_1.UserType.ADMIN })
                .andWhere('user.id = :userId', { userId })
                .getOne();
            if (!user) {
                common_1.Logger.error("permession denied", 'UserService/validateThemeSuggestion');
                throw new common_1.HttpException("permession denied", common_1.HttpStatus.BAD_REQUEST);
            }
            await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .update()
                .set({ validated: true })
                .where('theme.id = :themeId', { themeId })
                .execute();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/validateThemeSuggestion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllThemes() {
        try {
            const manager = (0, typeorm_1.getManager)();
            const themeSuggestions = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where('theme.validated = true')
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher', 'theme.suggestedByTeacher IS NOT NULL')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise', 'theme.suggestedByEntreprise IS NOT NULL')
                .leftJoinAndSelect('theme.promotion', 'promotion')
                .getMany();
            return themeSuggestions;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getAllThemeSuggestions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getThemes(promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const themeSuggestions = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where('theme.validated = true')
                .andWhere('theme.promotionId = :promotionId', { promotionId })
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher', 'theme.suggestedByTeacher IS NOT NULL')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise', 'theme.suggestedByEntreprise IS NOT NULL')
                .getMany();
            return themeSuggestions;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getThemes');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTheme(themeId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const theme = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where("theme.id = :themeId", { themeId })
                .leftJoinAndSelect('theme.suggestedByTeacher', 'suggestedByTeacher')
                .leftJoinAndSelect('theme.suggestedByEntreprise', 'suggestedByEntreprise')
                .leftJoinAndSelect('theme.documents', 'documents')
                .leftJoinAndSelect('theme.promotion', 'promotion')
                .leftJoinAndSelect('theme.teams', 'teams')
                .leftJoinAndSelect('theme.encadrement', 'encadrement')
                .leftJoinAndSelect('encadrement.teacher', 'teacher')
                .leftJoinAndSelect('teacher.teamsInCharge', 'teamsInCharge')
                .leftJoinAndSelect('teamsInCharge.team', 'team')
                .getOne();
            return theme;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTheme');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendWishList(userId, promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            const promotion = await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder('promotion')
                .where('promotion.id = :promotionId', { promotionId })
                .leftJoinAndSelect("promotion.teams", "team")
                .loadRelationCountAndMap("team.membersCount", "team.students")
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "UserService/submitWishList");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            if (!promotion) {
                common_1.Logger.log("promotion not found", "UserService/submitWishList");
                throw new common_1.HttpException("promotion not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const allTeamsAreValid = promotion.teams.every(team => {
                return team.membersCount >= promotion.minMembersInTeam && team.membersCount <= promotion.maxMembersInTeam;
            });
            if (!allTeamsAreValid) {
                common_1.Logger.log("il existe des equipe non valide", "UserService/submitWishList");
                throw new common_1.HttpException("il existe des equipe non valide", common_1.HttpStatus.BAD_REQUEST);
            }
            const students = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .where('student.promotionId = :promotionId', { promotionId })
                .andWhere('student.teamId IS NULL')
                .getMany();
            if ((students === null || students === void 0 ? void 0 : students.length) > 0) {
                common_1.Logger.log("il existe des etudiants sans equipes", "UserService/submitWishList");
                throw new common_1.HttpException("il existe des etudiants sans equipes", common_1.HttpStatus.BAD_REQUEST);
            }
            return await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder('promotion')
                .update()
                .set({ wishListSent: true })
                .where('promotion.id = :pomotionId', { promotionId })
                .execute();
        }
        catch (err) {
            common_1.Logger.log(err, "UserService/submitWishList");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async submitWishList(userId, wishList) {
        try {
            const manager = (0, typeorm_1.getManager)();
            common_1.Logger.error(wishList, 'DEbuuuug');
            const student = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .where("student.userId = :userId", { userId })
                .innerJoinAndSelect('student.team', 'team')
                .innerJoinAndSelect('team.teamLeader', 'teamLeader')
                .andWhere('teamLeader.id = student.id')
                .leftJoinAndSelect('student.promotion', 'promotion')
                .leftJoinAndSelect('promotion.themes', 'themes')
                .andWhere('themes.validated = true')
                .getOne();
            if (!student) {
                common_1.Logger.error("Permission denied", 'UserService/submitWishList');
                throw new common_1.HttpException("Permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const wish = await manager.getRepository(wish_entity_1.WishEntity)
                .createQueryBuilder('wish')
                .where('wish.teamId IS NOT NULL and wish.teamId = :teamId', { teamId: student.team.id })
                .getOne();
            if (wish) {
                common_1.Logger.error("your team already submeted the wish list", 'UserService/submitWishList');
                throw new common_1.HttpException("your team already submeted the wish list", common_1.HttpStatus.BAD_REQUEST);
            }
            const { wishes } = wishList;
            if ((wishes === null || wishes === void 0 ? void 0 : wishes.length) == 0) {
                common_1.Logger.error("wishes not found", 'UserService/submitWishList');
                throw new common_1.HttpException("wishes not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const newWishList = [];
            const themeIds = wishes.map(el => el.themeId);
            const themes = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where('theme.id  in (:...themeIds)', { themeIds: themeIds })
                .getMany();
            if (themeIds.length !== student.promotion.themes.length) {
                common_1.Logger.error("wrong number of themes", 'UserService/submitWishList');
                throw new common_1.HttpException("wrong number of themes", common_1.HttpStatus.BAD_REQUEST);
            }
            wishes.forEach(async (el, index) => {
                newWishList.push({
                    order: el.order,
                    team: student.team,
                    theme: themes[index]
                });
            });
            await manager.getRepository(wish_entity_1.WishEntity)
                .save(newWishList);
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/submitWishList');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async encadrerTheme(userId, themeId, teacherId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "UserService/encadrerTheme");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const theme = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where('theme.id = :themeId', { themeId })
                .andWhere('theme.validated = true')
                .getOne();
            if (!theme) {
                common_1.Logger.log("theme not found", "UserService/encadrerTheme");
                throw new common_1.HttpException("theme not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const teacher = await manager.getRepository(teacher_entity_1.TeacherEntity)
                .createQueryBuilder('teacher')
                .where('teacher.id = :teacherId', { teacherId })
                .getOne();
            if (!teacher) {
                common_1.Logger.log("teacher not found", "UserService/encadrerTheme");
                throw new common_1.HttpException("teacher not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const encadrement = await manager.getRepository(encadrement_entity_1.EncadrementEntity)
                .createQueryBuilder('encadrement')
                .where('encadrement.teacherId = :teacherId and encadrement.themeId = :themeId', { teacherId, themeId })
                .getOne();
            if (encadrement) {
                common_1.Logger.log("l'ensiegnant est deja un encadreur de ce theme", "UserService/encadrerTheme");
                throw new common_1.HttpException("l'ensiegnant est deja un encadreur de ce theme", common_1.HttpStatus.BAD_REQUEST);
            }
            await manager.getRepository(encadrement_entity_1.EncadrementEntity)
                .createQueryBuilder('')
                .insert()
                .values({ theme, teacher })
                .execute();
        }
        catch (err) {
            common_1.Logger.log(err, "UserService/encadrerTheme");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async assignTeamsToTeacher(userId, teamIds, teacherId) {
        try {
            console.log(teacherId, 'kkkkkkkkkkkk');
            const manager = (0, typeorm_1.getManager)();
            const user = manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "UserService/assignTeamToTeacher");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const encadrement = await manager.getRepository(encadrement_entity_1.EncadrementEntity)
                .createQueryBuilder('encadrement')
                .where('encadrement.teacherId = :teacherId', { teacherId })
                .innerJoinAndSelect('encadrement.teacher', 'teacher')
                .innerJoinAndSelect('encadrement.theme', 'theme')
                .innerJoinAndSelect('theme.teams', 'team')
                .andWhere('team.id IN  (:...teamIds)', { teamIds })
                .getOne();
            if (!encadrement || encadrement && encadrement.theme.teams.length < teamIds.length) {
                common_1.Logger.log("l'ensiegnant doit encadrer le theme affecter a l'equipe", "UserService/assignTeamsToTeacher");
                throw new common_1.HttpException("l'ensiegnant doit encadrer le theme affecter a l'equipe", common_1.HttpStatus.BAD_REQUEST);
            }
            const responsible = await manager.getRepository(responsible_entity_1.ResponsibleEntity)
                .createQueryBuilder('responsible')
                .where('responsible.teamId in (:...teamIds)', { teamIds })
                .getMany();
            if (responsible.length > 0) {
                common_1.Logger.log("l(es) equipe(s) sont deja sous la responsabilite de l'ensiegnant", "UserService/assignTeamsToTeacher");
                throw new common_1.HttpException("l(es) equipe(s) sont deja sous la responsabilite de l'ensiegnant", common_1.HttpStatus.BAD_REQUEST);
            }
            await manager.getRepository(responsible_entity_1.ResponsibleEntity)
                .save(encadrement.theme.teams.map(team => {
                return { teacher: encadrement.teacher, team };
            }));
        }
        catch (err) {
            common_1.Logger.log(err, "UserService/assignTeamToTeacher");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async completeTeams(userId, promotionId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            const promotion = await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder('promotion')
                .where('promotion.id = :promotionId', { promotionId })
                .leftJoinAndSelect("promotion.teams", "team")
                .leftJoinAndSelect('team.students', 'students')
                .leftJoinAndSelect('team.teamLeader', 'teamLeader')
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "UserService/submitWishList");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            if (!promotion) {
                common_1.Logger.log("promotion not found", "UserService/submitWishList");
                throw new common_1.HttpException("promotion not found", common_1.HttpStatus.BAD_REQUEST);
            }
            let teamsExtraMembers = [];
            let teamsNeedMembers = [];
            const studentsAddToTeamLater = [];
            const studentsModifiedTeams = [];
            let studentsToBeInsertedInNewTeam = [];
            promotion.teams.forEach(team => {
                if (team.students.length >= promotion.minMembersInTeam) {
                    teamsExtraMembers.push(team);
                }
                else if (team.students.length < promotion.minMembersInTeam) {
                    teamsNeedMembers.push(team);
                }
            });
            const students = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .where('student.promotionId = :promotionId', { promotionId })
                .andWhere('student.teamId IS NULL')
                .getMany();
            teamsNeedMembers = teamsNeedMembers.sort((a, b) => a.membersCount - b.membersCount);
            let i = 0;
            let j = 0;
            while (i < teamsNeedMembers.length && j < students.length) {
                const teamNeedMembers = teamsNeedMembers[i];
                let toBeCompleted = promotion.minMembersInTeam - teamNeedMembers.students.length;
                while (toBeCompleted > 0 && j < students.length) {
                    teamNeedMembers.students.push(students[j]);
                    studentsAddToTeamLater.push({ student: students[j], team: teamNeedMembers });
                    toBeCompleted = promotion.minMembersInTeam - teamNeedMembers.students.length;
                    if (toBeCompleted === 0) {
                        teamsNeedMembers = teamsNeedMembers.filter(el => el.id === teamNeedMembers.id);
                    }
                    j++;
                }
                i++;
            }
            let studentsNotYetInserted = students.slice(j, students.length);
            if (teamsNeedMembers.length === 0) {
                let i = 0;
                let j = 0;
                while (i < promotion.teams.length && j < studentsNotYetInserted.length) {
                    const tm = promotion.teams[i];
                    const nb = studentsAddToTeamLater.filter(({ team }) => team.id === tm.id).length;
                    let numberOfStudents = tm.students.length + nb;
                    let toBeFull = promotion.maxMembersInTeam - numberOfStudents;
                    while (toBeFull > 0 && j < studentsNotYetInserted.length) {
                        studentsAddToTeamLater.push({ student: studentsNotYetInserted[j], team: tm });
                        toBeFull--;
                        j++;
                    }
                    i++;
                }
                studentsNotYetInserted = studentsNotYetInserted.slice(j, studentsNotYetInserted.length);
                if (studentsNotYetInserted.length > 0) {
                    studentsToBeInsertedInNewTeam = [...studentsNotYetInserted];
                }
            }
            else {
                let i = 0;
                while (i < teamsExtraMembers.length && teamsNeedMembers.length > 0) {
                    const extra = teamsExtraMembers[i].students.length - promotion.minMembersInTeam;
                    if (extra !== 0) {
                        const teamExtraMembers = teamsExtraMembers[i];
                        const extraStudent = teamExtraMembers.students.find(st => teamExtraMembers.teamLeader.id !== st.id);
                        teamExtraMembers.students = teamExtraMembers.students.filter(st => st.id !== extraStudent.id);
                        studentsModifiedTeams.push({ student: extraStudent, from: teamExtraMembers, to: teamsNeedMembers[teamsNeedMembers.length - 1] });
                        teamsNeedMembers.pop();
                    }
                    i++;
                }
            }
            return {
                studentsAddToTeamLater,
                studentsModifiedTeams,
                studentsToBeInsertedInNewTeam
            };
        }
        catch (err) {
            common_1.Logger.log(err, "UserService/completeTeams");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async asignThemesToTeams(userId, promotionId, method) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "UserService/asignThemeToTeams");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const Themes = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .leftJoinAndSelect('theme.promotion', 'promotion')
                .where('promotion.id = :promotionId', { promotionId })
                .andWhere('theme.validated = true')
                .leftJoinAndSelect('theme.wishes', 'wish')
                .leftJoinAndSelect('wish.team', 'team')
                .orderBy('wish.order', 'ASC')
                .leftJoinAndSelect('team.students', 'student')
                .getMany();
            const teams = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .where(qb => `team.id not in ${qb.subQuery()
                .select('wish.teamId').from(wish_entity_1.WishEntity, 'wish').getQuery()}`)
                .getMany();
            if (teams.length > 0) {
                const newWishes = [];
                let newThemes = JSON.parse(JSON.stringify(Themes));
                newThemes = newThemes.map(nth => {
                    const newNth = Object.assign({}, nth);
                    delete newNth.promotion;
                    delete newNth.wishes;
                    delete newNth.team;
                    return newNth;
                });
                teams.forEach(team => {
                    newThemes.forEach((th, index) => {
                        newWishes.push({
                            team,
                            order: index,
                            theme: th
                        });
                    });
                });
                await manager.getRepository(wish_entity_1.WishEntity)
                    .save(newWishes);
            }
            const af_team_to_th = {};
            const ignoreTeam = new Set();
            Themes.forEach(theme => {
                af_team_to_th[theme.id] = [];
                const { maxTeamForTheme } = theme.promotion;
                let wishes = theme.wishes;
                if (method === 'moy') {
                    wishes = theme.wishes.sort((a, b) => {
                        const getMoyTeam = team => {
                            let sum = 0;
                            team.students.forEach(st => {
                                sum += st.moy;
                            });
                            return sum / team.students.length;
                        };
                        return (a.order === b.order) ? getMoyTeam(a.team) - getMoyTeam(b.team) : 0;
                    });
                }
                else if (method === 'random') {
                    wishes = theme.wishes.sort((a, b) => {
                        return (a.order === b.order) ? 0.5 - Math.random() : 0;
                    });
                }
                else if (method === 'time') {
                    wishes = theme.wishes.sort((a, b) => {
                        return (a.order === b.order) ? (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) : 0;
                    });
                }
                for (let k in wishes) {
                    const wish = wishes[k];
                    const { team, order } = wish;
                    if (ignoreTeam.has(team.id)) {
                        continue;
                    }
                    if (af_team_to_th[theme.id].length < maxTeamForTheme) {
                        console.log("____________________");
                        console.log("maxTeamForTheme:", maxTeamForTheme);
                        console.log("af_team_to_th[theme.id].length:", af_team_to_th[theme.id].length);
                        af_team_to_th[theme.id].push(team);
                        ignoreTeam.add(team.id);
                    }
                }
            });
            return Object.keys(af_team_to_th).map(el => {
                const teams = af_team_to_th[el].map(team => {
                    const newTeam = Object.assign({}, team);
                    delete newTeam.students;
                    return newTeam;
                });
                const { title, id } = Themes.find(th => th.id === el);
                return {
                    theme: {
                        id,
                        title
                    },
                    teams
                };
            });
        }
        catch (err) {
            common_1.Logger.log(err, "UserService/asignThemeToTeams");
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async applyThemesToTeamsAssignements(userId, data) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const user = manager.getRepository(user_entity_1.UserEntity)
                .createQueryBuilder('user')
                .where("user.id = :userId", { userId })
                .andWhere("user.userType = :userType", { userType: user_entity_1.UserType.ADMIN })
                .getOne();
            if (!user) {
                common_1.Logger.log("permission denied", "UserService/applyThemesToTeamsAssignements");
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            let fetchTeamIds = [];
            let themeIds = [];
            console.log(data, '77777777');
            for (let k in data.themeToTeam) {
                const el = data.themeToTeam[k];
                const { idTheme, teamIds } = el;
                console.log(el, '55555555555');
                themeIds.push(idTheme);
                fetchTeamIds = [...fetchTeamIds, ...teamIds];
            }
            const themes = await manager.getRepository(theme_entity_1.ThemeEntity)
                .createQueryBuilder('theme')
                .where('theme.id IN (:...themeIds)', { themeIds })
                .getMany();
            const teams = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .where('team.id IN (:...fetchTeamIds)', { fetchTeamIds })
                .getMany();
            if (themes.length != themeIds.length) {
                common_1.Logger.error("error in theme ids", 'UserService/applyThemesToTeamsAssignements');
                throw new common_1.HttpException("error in theme ids", common_1.HttpStatus.BAD_REQUEST);
            }
            if (teams.length !== fetchTeamIds.length) {
                common_1.Logger.error("error in team ids", 'UserService/applyThemesToTeamsAssignements');
                throw new common_1.HttpException("error in team ids", common_1.HttpStatus.BAD_REQUEST);
            }
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                data.themeToTeam.forEach(async ({ idTheme, teamIds }) => {
                    const theme = themes.find(el => el.id === idTheme);
                    teamIds.forEach(async (teamId) => {
                        await manager.getRepository(team_entity_1.TeamEntity)
                            .createQueryBuilder('team')
                            .update()
                            .set({ givenTheme: theme })
                            .where('team.id = :teamId', { teamId })
                            .execute();
                    });
                });
            });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/applyThemesToTeamsAssignements');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeams() {
        try {
            const manager = (0, typeorm_1.getManager)();
            const teams = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .leftJoinAndSelect('team.givenTheme', 'givenTheme')
                .loadRelationCountAndMap('team.membersCount', 'team.students')
                .leftJoinAndSelect('team.promotion', 'promotion')
                .getMany();
            return teams.map(({ nickName, givenTheme, membersCount, id, promotion }) => {
                common_1.Logger.error(nickName, promotion, "debug");
                return {
                    id,
                    pseudo: nickName,
                    theme: givenTheme,
                    nombre: membersCount,
                    promotion: promotion.name,
                    validated: membersCount >= promotion.minMembersInTeam && membersCount <= promotion.maxMembersInTeam
                };
            });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeams');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeam(teamId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const team = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .where('team.id = :teamId', { teamId })
                .leftJoinAndSelect('team.givenTheme', 'givenTheme')
                .leftJoinAndSelect('team.students', 'members')
                .leftJoinAndSelect('team.promotion', 'promotion')
                .leftJoinAndSelect('team.teamLeader', 'leader')
                .getOne();
            const { id, nickName, givenTheme, students, promotion, teamLeader } = team;
            return {
                id,
                pseudo: nickName,
                theme: givenTheme,
                members: students,
                promotion: promotion,
                validated: students.length >= promotion.minMembersInTeam && students.length <= promotion.maxMembersInTeam,
                teamLeader
            };
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeam');
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
    async createNewConfig(key, value) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const sql = manager.getRepository(config_entity_1.ConfigEntity)
                .createQueryBuilder()
                .insert()
                .values({ key, value }).getSql();
            await manager.getRepository(config_entity_1.ConfigEntity)
                .createQueryBuilder()
                .insert()
                .values({ key, value })
                .execute();
            common_1.Logger.error(sql, "userService/createNewConfig");
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createNewConfig');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createNewPromotion(name, documentTypes) {
        try {
            const manager = (0, typeorm_1.getManager)();
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                const promotion = manager.getRepository(promotion_entity_1.PromotionEntity).create({ name });
                await manager.getRepository(promotion_entity_1.PromotionEntity)
                    .createQueryBuilder()
                    .insert()
                    .values(promotion)
                    .execute();
                let docTypes = [];
                const docType = manager.getRepository(document_types_entity_1.DocumentTypeEntity).create({ name: 'autres', promotion });
                docTypes.push(docType);
                for (let k in documentTypes) {
                    const docnName = documentTypes[k];
                    const docType = manager.getRepository(document_types_entity_1.DocumentTypeEntity).create({ name: docnName, promotion });
                    docTypes.push(docType);
                }
                await manager.getRepository(document_types_entity_1.DocumentTypeEntity)
                    .save(docTypes);
            });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createNewPromotion');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllPromotions() {
        try {
            const manager = (0, typeorm_1.getManager)();
            return await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder()
                .getMany();
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getAllPromotions');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getPromotionDocumentTypes(userId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const student = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .where('student.userId = :userId', { userId })
                .leftJoinAndSelect('student.promotion', 'promotion')
                .leftJoinAndSelect('promotion.documentTypes', 'documentTypes')
                .getOne();
            if (!student) {
                common_1.Logger.error("permession denied", 'UserService/getPromotionDocumentTypes');
                throw new common_1.HttpException("permession denied", common_1.HttpStatus.BAD_REQUEST);
            }
            return student.promotion.documentTypes;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getPromotionDocumentTypes');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry,
        socket_service_1.SocketService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map