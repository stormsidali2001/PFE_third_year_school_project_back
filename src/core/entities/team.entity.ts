import {  Column, Entity, JoinColumn, Long, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { AnnouncementEntity } from "./announcement.entity";
import { MeetEntity } from "./meet.entity";
import { ModificationActionEntity } from "./modification.action.entity";
import { PromotionEntity } from "./promotion.entity";
import { ResponsibleEntity } from "./responsible.entity";
import { StudentEntity } from "./student.entity";
import { SurveyEntity } from "./survey.entity";
import { TeamChatMessageEntity } from "./team.chat.message.entity";
import { CommitEntity } from "./commit.entity";
import { TeamDocumentEntity } from "./team.document.entity";
import { ThemeEntity } from "./theme.entity";
import { WishEntity } from "./wish.entity";
import { SoutenanceEntity } from "./soutenance.entity";


@Entity('team')
export class TeamEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column({unique:true})
    nickName:string;

    @Column({
        default:''
    })
    description:string;

    @Column({
        default:''
    })
    rules:string;

    @Column({
        default:false
    })
    peutSoutenir:boolean;
    //relations}
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

    @OneToMany(type=>CommitEntity,teamDocumentCommit=>teamDocumentCommit.team)
    commits:CommitEntity[];

    @ManyToOne(type=>PromotionEntity,promotion=>promotion.teams)
    promotion:PromotionEntity;

    @OneToMany(type=>WishEntity,wish=>wish.team)
    wishes:WishEntity[];

    @OneToMany(type=>ResponsibleEntity,res=>res.team)
    responsibleTeachers:ResponsibleEntity[];


    @OneToOne(type=>SoutenanceEntity) 
    soutenance:SoutenanceEntity;
    
  
    

  



 
}