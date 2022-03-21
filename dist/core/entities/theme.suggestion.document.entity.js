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
exports.ThemeSuggestionDocumentEntity = void 0;
const typeorm_1 = require("typeorm");
const document_data_1 = require("../abstracts/document.data");
const theme_suggestion_1 = require("./theme.suggestion");
let ThemeSuggestionDocumentEntity = class ThemeSuggestionDocumentEntity extends document_data_1.DoucmentData {
};
__decorate([
    (0, typeorm_1.ManyToOne)(type => theme_suggestion_1.ThemeSuggestionEntity, themeSuggestion => themeSuggestion.documents),
    __metadata("design:type", ThemeSuggestionDocumentEntity)
], ThemeSuggestionDocumentEntity.prototype, "themeSuggestion", void 0);
ThemeSuggestionDocumentEntity = __decorate([
    (0, typeorm_1.Entity)('theme_suggestion_document')
], ThemeSuggestionDocumentEntity);
exports.ThemeSuggestionDocumentEntity = ThemeSuggestionDocumentEntity;
//# sourceMappingURL=theme.suggestion.document.entity.js.map