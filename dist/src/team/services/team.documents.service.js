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
exports.TeamDocumentsService = void 0;
const common_1 = require("@nestjs/common");
const document_types_entity_1 = require("../../core/entities/document-types.entity");
const team_document_entity_1 = require("../../core/entities/team.document.entity");
const team_entity_1 = require("../../core/entities/team.entity");
const socket_service_1 = require("../../socket/socket.service");
const user_service_1 = require("../../user/user.service");
const typeorm_1 = require("typeorm");
const fs = require("fs");
const path = require("path");
const student_entity_1 = require("../../core/entities/student.entity");
const responsible_entity_1 = require("../../core/entities/responsible.entity");
const commit_entity_1 = require("../../core/entities/commit.entity");
const commit_document_entity_1 = require("../../core/entities/commit.document.entity");
let TeamDocumentsService = class TeamDocumentsService {
    constructor(userService, socketService) {
        this.userService = userService;
        this.socketService = socketService;
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
            const socket = this.socketService.socket;
            socket.to(team.id).emit("team-documents-alltered");
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
            const socket = this.socketService.socket;
            socket.to(team.id).emit("team-documents-alltered");
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/deleteTeamDocs');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateTeamDocument(userId, documentId, description, name, documentTypeId) {
        try {
            const manager = (0, typeorm_1.getManager)();
            const document = await manager.getRepository(team_document_entity_1.TeamDocumentEntity)
                .createQueryBuilder('document')
                .where('document.id = :documentId', { documentId })
                .leftJoinAndSelect('document.owner', 'owner')
                .innerJoinAndSelect('document.team', 'team')
                .innerJoinAndSelect('team.students', 'students')
                .andWhere('students.userId = :userId', { userId })
                .leftJoinAndSelect('team.teamLeader', 'teamLeader')
                .getOne();
            if (!document) {
                common_1.Logger.error("document not found", 'UserService/updateDocument');
                throw new common_1.HttpException("document not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const isTeamLeader = document.team.teamLeader.id === document.team.students[0].id;
            const isOwner = document.team.students[0].id === document.owner.id;
            if (!isTeamLeader && !isOwner) {
                common_1.Logger.error("permission denied", 'UserService/updateDocument');
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const documentType = await manager.getRepository(document_types_entity_1.DocumentTypeEntity)
                .createQueryBuilder("docType")
                .where("docType.id = :documentTypeId", { documentTypeId })
                .getOne();
            if (!documentType) {
                common_1.Logger.error("document type not found", 'UserService/updateDocument');
                throw new common_1.HttpException("document type not found", common_1.HttpStatus.BAD_REQUEST);
            }
            await manager.getRepository(team_document_entity_1.TeamDocumentEntity)
                .createQueryBuilder('document')
                .update()
                .set({ description, name, type: documentType })
                .where('team_document.id = :documentId', { documentId })
                .execute();
            const socket = this.socketService.socket;
            socket.to(document.team.id).emit("team-documents-alltered");
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/updateDocument');
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
                .innerJoinAndSelect('team.teamLeader', 'teamLeader')
                .andWhere('teamLeader.id = student.id')
                .innerJoinAndSelect('team.givenTheme', 'givenTheme')
                .getOne();
            if (!student) {
                common_1.Logger.error("permission denied", 'UserService/commitDocs');
                throw new common_1.HttpException("permission denied", common_1.HttpStatus.BAD_REQUEST);
            }
            const responsibles = await manager.getRepository(responsible_entity_1.ResponsibleEntity)
                .createQueryBuilder('res')
                .leftJoinAndSelect('res.team', 'resTeam')
                .where('res.teamId = :teamId', { teamId: student.team.id })
                .andWhere('res.themeId = :themeId', { themeId: student.team.givenTheme.id })
                .leftJoinAndSelect('res.teacher', 'teacher')
                .leftJoinAndSelect("teacher.user", 'user')
                .getMany();
            if (responsibles.length === 0) {
                common_1.Logger.error("aucun ensignant encadrant le theme donnee a l'equipe est responsable de cette derniere ", 'UserService/commitDocs');
                throw new common_1.HttpException("aucun ensignant encadrant le theme donnee a l'equipe est responsable de cette derniere ", common_1.HttpStatus.BAD_REQUEST);
            }
            const teamDocs = await manager.getRepository(team_document_entity_1.TeamDocumentEntity)
                .createQueryBuilder('doc')
                .where('doc.id in (:...docsIds)', { docsIds })
                .andWhere('doc.teamId = :teamId', { teamId: student.team.id })
                .leftJoinAndSelect('doc.type', 'type')
                .getMany();
            if (teamDocs.length !== docsIds.length) {
                common_1.Logger.error("wrong doc ids", 'UserService/commitDocs');
                throw new common_1.HttpException("wrong doc ids", common_1.HttpStatus.BAD_REQUEST);
            }
            const commit = manager.getRepository(commit_entity_1.CommitEntity)
                .create({ title, description, team: student.team });
            await (0, typeorm_1.getConnection)().transaction(async (manager) => {
                await manager.getRepository(commit_entity_1.CommitEntity).save(commit);
                const docsToCommit = [];
                teamDocs.forEach(teamDoc => {
                    const extension = teamDoc.url.slice(teamDoc.url.lastIndexOf("."), teamDoc.url.length);
                    const url = './files/' + teamDoc.name + Date.now() + '.' + extension;
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
                for (let k in responsibles) {
                    const res = responsibles[k];
                    const userId = res.teacher.user.id;
                    await this.userService._sendNotfication(userId, `l'equipe : ${res.team.nickName} a commiter des nouveaux documents`);
                }
            });
        }
        catch (err) {
            common_1.Logger.error(err, 'UserService/commitDocs');
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
TeamDocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        socket_service_1.SocketService])
], TeamDocumentsService);
exports.TeamDocumentsService = TeamDocumentsService;
//# sourceMappingURL=team.documents.service.js.map