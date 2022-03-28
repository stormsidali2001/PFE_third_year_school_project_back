import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StudentEntity } from "./student.entity";
import { SurveyEntity } from "./survey.entity";
import { SurveyOptionEntity } from "./survey.option.entity";

@Entity('survey_participant')
export class SurveyParticipantEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    argument:string;

    
    

    //relations
    @ManyToOne(type=>StudentEntity,student=>student.participationsInSurveys)
    student:StudentEntity;

    @ManyToOne(type=>SurveyEntity,survey=>survey.participants)
    survey:SurveyEntity;

    @ManyToOne(type=>SurveyOptionEntity,option=>option.participations)
    answer:SurveyOptionEntity;



}
