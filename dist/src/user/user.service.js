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
    async addTeamDocument(userId, name, url, description) {
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
            const teamDocumentRepository = manager.getRepository(team_document_entity_1.TeamDocumentEntity);
            const teamDocument = teamDocumentRepository.create({ name, url, team, description, owner: team.students[0] });
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
                .andWhere('theme.promotionId = :promotionId', { promotionId })
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
                .leftJoinAndSelect('theme.docuements', 'documents')
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
                    validated: membersCount >= promotion.minTeam && membersCount <= promotion.maxTeam
                };
            });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeams');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTeam(teamId) {
        var _a, _b;
        try {
            const manager = (0, typeorm_1.getManager)();
            const team = await manager.getRepository(team_entity_1.TeamEntity)
                .createQueryBuilder('team')
                .where('team.id = :teamId', { teamId })
                .leftJoinAndSelect('team.givenTheme', 'givenTheme')
                .leftJoinAndSelect('team.students', 'students')
                .getOne();
            const { id, nickName, givenTheme, students, description, rules } = team;
            const configs = await manager.getRepository(config_entity_1.ConfigEntity)
                .createQueryBuilder('config')
                .where('config.key = "minTeam" or config.key = "maxTeam"')
                .getMany();
            let minTeam = (_a = configs.find(el => el.key === 'minTeam')) === null || _a === void 0 ? void 0 : _a.value;
            let maxTeam = (_b = configs.find(el => el.key === 'maxTeam')) === null || _b === void 0 ? void 0 : _b.value;
            if (!minTeam || !maxTeam) {
                common_1.Logger.error("minTeam and maxTeam configuration variables are not defined !!!", "UserService/getTeams");
                throw new common_1.HttpException("internal  server error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            minTeam = parseInt(minTeam);
            maxTeam = parseInt(maxTeam);
            const membersCount = students.length;
            return {
                id,
                pseudo: nickName,
                theme: givenTheme,
                members: students,
                validated: membersCount >= minTeam && membersCount <= maxTeam,
                description,
                rules
            };
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getTeams');
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
    async createNewPromotion(name) {
        try {
            const manager = (0, typeorm_1.getManager)();
            await manager.getRepository(promotion_entity_1.PromotionEntity)
                .createQueryBuilder()
                .insert()
                .values({ name })
                .execute();
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
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry,
        socket_service_1.SocketService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map