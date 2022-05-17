import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeacherEntity } from "./teacher.entity";
import { TeamEntity } from "./team.entity";
import { ThemeSuggestionDocumentEntity } from "./theme.suggestion.document.entity";

@Entity('theme_suggestion')
export class ThemeSuggestionEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column()
    title:string;

    @Column()
    description:string;

    //relations
    @OneToMany(type=>ThemeSuggestionDocumentEntity,themeSuggestionDocument=>themeSuggestionDocument.themeSuggestion)
    documents:ThemeSuggestionDocumentEntity[];

    //a suggestion is made by either a teacher or a team not both
    @ManyToOne(type=>TeacherEntity,teacher=>teacher.themeSuggestions)
    teacher:TeacherEntity;

  
}