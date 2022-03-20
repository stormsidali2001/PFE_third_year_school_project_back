import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SurveyEntity } from "./survey.entity";

@Entity('survey_option')
export class SurveyOptionEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    description:string;

    //relation
    @ManyToOne(type=>SurveyEntity,survey=>survey.options)
    survey:SurveyEntity;
}