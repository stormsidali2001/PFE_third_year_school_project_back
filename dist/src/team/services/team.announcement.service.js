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
exports.TeamAnnouncementService = void 0;
const common_1 = require("@nestjs/common");
const announcement_document_entity_1 = require("../../core/entities/announcement.document.entity");
const announcement_entity_1 = require("../../core/entities/announcement.entity");
const student_entity_1 = require("../../core/entities/student.entity");
const user_service_1 = require("../../user/user.service");
const typeorm_1 = require("typeorm");
let TeamAnnouncementService = class TeamAnnouncementService {
    constructor(userService) {
        this.userService = userService;
    }
    async createTeamAnnouncement(userId, title, description, documents) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const student = await manager.getRepository(student_entity_1.StudentEntity)
                .createQueryBuilder('student')
                .where('student.userId = :userId', { userId })
                .innerJoinAndSelect('student.team', 'team')
                .innerJoinAndSelect('team.teamLeader', 'teamLeader')
                .andWhere('teamLeader.id = student.id')
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
            this.userService._sendTeamNotfication(student.team.id, `a new announcement with  title: ${announcement.title} is available`, student.id);
            return student;
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/createTeamAnnouncement');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAnnouncements(userId) {
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
};
TeamAnnouncementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], TeamAnnouncementService);
exports.TeamAnnouncementService = TeamAnnouncementService;
//# sourceMappingURL=team.announcement.service.js.map