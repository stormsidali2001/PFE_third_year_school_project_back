import { TeacherEntity } from "./teacher.entity";
import { ThemeSuggestionDocumentEntity } from "./theme.suggestion.document.entity";
export declare class ThemeSuggestionEntity {
    id: string;
    title: string;
    description: string;
    documents: ThemeSuggestionDocumentEntity[];
    teacher: TeacherEntity;
    team: TeacherEntity;
}
