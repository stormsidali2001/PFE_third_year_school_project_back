
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { DoucmentData } from "../abstracts/document.data";
import { DocumentTypeEntity } from "./document-types.entity";
import { EvaluationEntity } from "./evaluation.entity";
import { ModificationActionEntity } from "./modification.action.entity";
import { ResponsibleEntity } from "./responsible.entity";
import { StudentEntity } from "./student.entity";
import { TeamEntity } from "./team.entity";

@Entity('team_document')
export class TeamDocumentEntity extends DoucmentData{
    
 
    @Column({
        default:''
    })
    description:string;

   



    //relations


    @ManyToOne(type=>TeamEntity,team=>team.documents)
    team:TeamEntity;

    @ManyToOne(type=>StudentEntity,student=>student.documents)
    owner:StudentEntity;


    @OneToOne(type=>EvaluationEntity) @JoinColumn()
    evaluation:EvaluationEntity;
    
    @OneToMany(type=>ModificationActionEntity,modificationAction=>modificationAction.teamDocument)
    modificationActions:ModificationActionEntity[];

  
    @OneToOne(type=>DocumentTypeEntity) @JoinColumn()
    type:DocumentTypeEntity;
    

  



}