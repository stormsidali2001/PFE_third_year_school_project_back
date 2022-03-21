import {  Column, Entity, JoinColumn, Long, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { AnnouncementEntity } from "./announcement.entity";
import { MeetEntity } from "./meet.entity";
import { ModificationActionEntity } from "./modification.action.entity";
import { StudentEntity } from "./student.entity";
import { SurveyEntity } from "./survey.entity";
import { TeamChatMessageEntity } from "./team.chat.message.entity";
import { TeamDocumentCommit } from "./team.document.commit.entity";
import { TeamDocumentEntity } from "./team.document.entity";
import { ThemeEntity } from "./theme.entity";
import { ThemeSuggestionEntity } from "./theme.suggestion";


@Entity('team')
export class TeamEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column()
    nickName:string;

    @Column()
    description:string;

    @Column()
    rules:string;
    //relations
    //for invitation
    @OneToMany(type=>StudentEntity,student=>student.team)
    students:StudentEntity[];

    @OneToOne(type=>StudentEntity) @JoinColumn()
    teamLeader:StudentEntity;
    //for the quality manager
    @OneToOne(type=>StudentEntity) @JoinColumn()
    qualityManager:StudentEntity;
    //for chat
    @OneToMany(type=>TeamChatMessageEntity,teamChatMessage=>teamChatMessage.message)
    teamMessages:TeamChatMessageEntity[];

    //for survey
    @OneToMany(type=>SurveyEntity,survey=>survey.team)
    surveys:SurveyEntity[];

    //for announcement
    @OneToMany(type=>AnnouncementEntity,announcement=>announcement.team)
    announcements:AnnouncementEntity[];

    //for team documents
    @OneToMany(type=>TeamDocumentEntity,teamDocument=>teamDocument.team)
    documents:TeamDocumentEntity[];

    @OneToMany(type=>ModificationActionEntity,modificationAction=>modificationAction.team)
    modificationActions:ModificationActionEntity[];

    //to theme
    @ManyToOne(type=>ThemeEntity,theme=>theme.teams)
    givenTheme:ThemeEntity;

    //to meet
    @OneToMany(type=>MeetEntity,meet=>meet.team)
    meets:MeetEntity[];

    @OneToMany(type=>TeamDocumentCommit,teamDocumentCommit=>teamDocumentCommit.team)
    documentCommits:TeamDocumentCommit[];

    //to theme suggestion
    @ManyToOne(type=>ThemeSuggestionEntity,themeSuggestion=>themeSuggestion.team)
    themeSuggestions:ThemeSuggestionEntity[];
    

  



 
}