import { Entity, ManyToOne } from "typeorm";
import { DoucmentData } from "../abstracts/document.data";
import { ThemeSuggestionEntity } from "./theme.suggestion";

@Entity('theme_suggestion_document')
export class ThemeSuggestionDocumentEntity extends DoucmentData{
    //relations
    @ManyToOne(type=>ThemeSuggestionEntity,themeSuggestion=>themeSuggestion.documents)
    themeSuggestion:ThemeSuggestionDocumentEntity;

}