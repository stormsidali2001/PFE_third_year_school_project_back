import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SurveyOptionEntity } from "./survey.option.entity";
import { SurveyParticipantEntity } from "./survey.participant.entity";
import { TeamEntity } from "./team.entity";

@Entity('survey')
export class SurveyEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    title:string;

    @Column()
    description:string;

    @CreateDateColumn()
    createdAt:Date;

    @Column()
    period:Date;

    //relations
    @ManyToOne(type=>TeamEntity,team=>team.surveys)
    team:TeamEntity;

    @OneToMany(type=>SurveyOptionEntity,surveyOption=>surveyOption.survey)
    options:SurveyOptionEntity[];

    //to SurveyParticipant
    @OneToMany(type=>SurveyParticipantEntity,surveyParticipant=>surveyParticipant.survey)
    participants:SurveyParticipantEntity[];

}