
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { DoucmentData } from "../abstracts/document.data";
import { EvaluationEntity } from "./evaluation.entity";
import { ModificationActionEntity } from "./modification.action.entity";
import { StudentEntity } from "./student.entity";
import { TeamDocumentCommit } from "./team.document.commit.entity";
import { TeamEntity } from "./team.entity";

@Entity('team_document')
export class TeamDocumentEntity extends DoucmentData{
    
    @Column({default:false})
    deleted:boolean;

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

    @ManyToOne(type=>TeamDocumentCommit,teamDocumentCommit=>teamDocumentCommit.documents)
    teamDocumentCommit:TeamDocumentCommit;

}