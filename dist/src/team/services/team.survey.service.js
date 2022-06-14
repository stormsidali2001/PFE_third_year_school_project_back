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
exports.TeamSurveyService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const student_entity_1 = require("../../core/entities/student.entity");
const survey_entity_1 = require("../../core/entities/survey.entity");
const survey_option_entity_1 = require("../../core/entities/survey.option.entity");
const survey_participant_entity_1 = require("../../core/entities/survey.participant.entity");
const user_service_1 = require("../../user/user.service");
const typeorm_1 = require("typeorm");
let TeamSurveyService = class TeamSurveyService {
    constructor(userService, schedulerRegistry) {
        this.userService = userService;
        this.schedulerRegistry = schedulerRegistry;
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
                .andWhere('teamLeader.id = student.id')
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
            this.userService._sendTeamNotfication(student.team.id, `a new survey has been created a survey with title: ${title}`);
            const job = new cron_1.CronJob(new Date(new Date(surveyData.createdAt).getTime() + period), () => {
                common_1.Logger.warn("survey period has ended", 'UserService/createSurvey');
                surveyRepository.update({ id: surveyData.id }, { close: true });
                this.userService._sendTeamNotfication(student.team.id, `the survey with title: ${title}  ended`);
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
};
TeamSurveyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        schedule_1.SchedulerRegistry])
], TeamSurveyService);
exports.TeamSurveyService = TeamSurveyService;
//# sourceMappingURL=team.survey.service.js.map