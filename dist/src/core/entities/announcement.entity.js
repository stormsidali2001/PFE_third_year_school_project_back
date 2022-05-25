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
exports.AnnouncementEntity = void 0;
const typeorm_1 = require("typeorm");
const announcement_document_entity_1 = require("./announcement.document.entity");
const team_entity_1 = require("./team.entity");
let AnnouncementEntity = class AnnouncementEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AnnouncementEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AnnouncementEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AnnouncementEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AnnouncementEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => announcement_document_entity_1.AnnouncementDocumentEntity, announcementDoc => announcementDoc.announcement),
    __metadata("design:type", Array)
], AnnouncementEntity.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => team_entity_1.TeamEntity, team => team.announcements),
    __metadata("design:type", team_entity_1.TeamEntity)
], AnnouncementEntity.prototype, "team", void 0);
AnnouncementEntity = __decorate([
    (0, typeorm_1.Entity)('annoncement')
], AnnouncementEntity);
exports.AnnouncementEntity = AnnouncementEntity;
//# sourceMappingURL=announcement.entity.js.map