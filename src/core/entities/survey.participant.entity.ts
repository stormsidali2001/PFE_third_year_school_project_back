import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StudentEntity } from "./student.entity";
import { SurveyEntity } from "./survey.entity";

@Entity('survey_participant')
export class SurveyParticipantEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    //relations
    @ManyToOne(type=>StudentEntity,student=>student.participationsInSurveys)
    student:StudentEntity;
    @ManyToOne(type=>SurveyEntity,survey=>survey.participants)
    survey:SurveyEntity;

}
