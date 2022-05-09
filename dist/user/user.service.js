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
let UserService = class UserService {
    constructor(schedulerRegistry, socketService) {
        this.schedulerRegistry = schedulerRegistry;
        this.socketService = socketService;
    }
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
    async sendATeamInvitation(userId, recieverId, description) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const sender = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .where('student.userId = :userId', { userId })
                .getOne();
            if (!sender) {
                common_1.Logger.error("sender not found", 'UserService/sendATeamInvitation');
                throw new common_1.HttpException("sender not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const reciever = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
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
            const invitationsRepository = manager.getRepository(invitation_entity_1.InvitationEntity);
            const invitation = invitationsRepository.create({ description, sender, reciever });
            await invitationsRepository.save(invitation);
            return `Invitation sent succesfully to ${reciever.firstName} ${reciever.lastName}`;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/sendATeamInvitation');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async acceptRefuseTeamInvitation(invitationId, userId, accepted) {
        const manager = (0, typeorm_1.getManager)();
        const invitationsRepository = manager.getRepository(invitation_entity_1.InvitationEntity);
        let invitation;
        try {
            invitation = await invitationsRepository
                .createQueryBuilder('invitation')
                .leftJoinAndSelect('invitation.sender', 'sender')
                .leftJoinAndSelect('invitation.reciever', 'reciever')
                .leftJoinAndSelect('sender.team', 'steam')
                .leftJoinAndSelect('reciever.team', 'rteam')
                .where('invitation.id = :invitationId', { invitationId })
                .andWhere('reciever.userId = :userId', { userId })
                .getOne();
            if (!invitation) {
                common_1.Logger.error("invitation not found", 'UserService/getAcceptRefuseTeamInvitation');
                throw new common_1.HttpException("invitation not found", common_1.HttpStatus.FORBIDDEN);
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
    async _sendNotfication(studentId, description) {
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
        socket.emit("test", "dsgggddgdgdsgjhdgskhdsghkgdhgdh");
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
        return `notification sent with success to team: ${team.nickName} members`;
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
    async submitSurveyAnswer(studentId, surveyId, optionId, argument) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const studentRepository = manager.getRepository(student_entity_1.StudentEntity);
            const student = await studentRepository.createQueryBuilder('student')
                .innerJoinAndSelect('student.team', 'team')
                .innerJoinAndSelect('team.surveys', 'surveys')
                .where('surveys.id = :surveyId', { surveyId })
                .innerJoinAndSelect('surveys.options', 'options')
                .where('student.id = :studentId', { studentId })
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
                .where('student.id = :studentId', { studentId })
                .andWhere('survey.id = :surveyId', { surveyId })
                .getOne();
            const surveyParticipant = surveyParticipantRepository.create({ survey: student.team.surveys[0], student: student, answer: student.team.surveys[0].options[0], argument });
            if (!existingSurveyParticipant) {
                await surveyParticipantRepository.save(surveyParticipant);
                return "survey answered succesfully";
            }
            if (surveyParticipant.answer.id === existingSurveyParticipant.answer.id) {
                common_1.Logger.error("you've already answered to the survey using that option", 'UserService/submitSurvey');
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
                .leftJoinAndSelect('survey.participants', 'participant')
                .getMany();
            return surveys;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/getSurveys');
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
            const student = await studentRepository
                .createQueryBuilder('student')
                .where('student.userId = :userId', { userId })
                .getOne();
            if (!student) {
                common_1.Logger.error("student not found", 'UserService/getStudentsWithoutTeam');
                throw new common_1.HttpException("student not found", common_1.HttpStatus.BAD_REQUEST);
            }
            return await studentRepository.createQueryBuilder('student')
                .where('student.userId <> :userId', { userId })
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
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry,
        socket_service_1.SocketService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map