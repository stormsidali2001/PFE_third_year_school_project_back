import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SurveyEntity } from "./survey.entity";
import { SurveyParticipantEntity } from "./survey.participant.entity";

@Entity('survey_option')
export class SurveyOptionEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    description:string;

    //relation
    @ManyToOne(type=>SurveyEntity,survey=>survey.options)
    survey:SurveyEntity;

    @OneToMany(type=>SurveyParticipantEntity,participation=>participation.answer)
    participations:SurveyParticipantEntity[];
}