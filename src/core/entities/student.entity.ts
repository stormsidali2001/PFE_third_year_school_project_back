import {  Column, CreateDateColumn, Entity, JoinColumn, Long, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { InvitationEntity } from "./invitation.entity";
import { MeetAbsentEntity } from "./meet.absent.entity";
import { NotificationEntity } from "./Notification.entity";
import { SurveyParticipantEntity } from "./survey.participant.entity";
import { TeamChatMessageEntity } from "./team.chat.message.entity";
import { TeamDocumentEntity } from "./team.document.entity";
import { TeamEntity } from "./team.entity";
import { UserEntity } from "./user.entity";


@Entity('student')
export class StudentEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @PrimaryColumn('')
    code:string;


    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column('date')
    dob:Date; 

 
    //relations
    @ManyToOne(type=>TeamEntity,team=>team.students)
    team:TeamEntity;
   
    @OneToOne(type=>UserEntity) 
    @JoinColumn()
    user:UserEntity

    @OneToMany(type=>InvitationEntity,invitation=>invitation.sender)
    sentInvitations:InvitationEntity[];

    @OneToMany(type=>InvitationEntity,invitation=>invitation.reciever)
    receivedInvitations:InvitationEntity[];

    @OneToMany(type=>TeamChatMessageEntity,teamChatMessage=>teamChatMessage.owner)
    teamChatMessages:TeamChatMessageEntity[];

    @OneToMany(type=>TeamDocumentEntity,teamDocument=>teamDocument.owner)
    documents:TeamDocumentEntity[];

    //to survey participant
    @OneToMany(type=>SurveyParticipantEntity,surveyParticipant=>surveyParticipant.student)
    participationsInSurveys:SurveyParticipantEntity[];

    //to meetAbsent
    @OneToMany(type=>MeetAbsentEntity,meetAbsent=>meetAbsent.student)
    meetAbsences:MeetAbsentEntity[];

  

    
}