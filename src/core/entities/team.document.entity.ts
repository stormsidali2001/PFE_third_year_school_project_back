
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { DoucmentData } from "../abstracts/document.data";
import { EvaluationEntity } from "./evaluation.entity";
import { ModificationActionEntity } from "./modification.action.entity";
import { ResponsibleEntity } from "./responsible.entity";
import { StudentEntity } from "./student.entity";
import { TeamDocumentCommit } from "./team.document.commit.entity";
import { TeamEntity } from "./team.entity";
export enum DocumentType {
    CAHIER_CHARGE = 'cahier_charge',
    CAHIER_ANALYSE = 'cahier_analyse',
    CAHIER_CONCEPTION = 'cahier_conception',
    CAHIER_ARCHITECTURE = 'cahier_architecture',
    CHARTE_NOMAGE_DOCUMENT = 'charte_nomage_document',
    CHARTE_NOMAGE_CODE = 'charte_nomage_code',
    PROFIL_MEMBRE = 'profil_membre',
    OTHERS = 'others'
}
@Entity('team_document')
export class TeamDocumentEntity extends DoucmentData{
    
 
    @Column({
        default:''
    })
    description:string;

    @Column({
        enum:DocumentType,
        default:DocumentType.OTHERS,
        type:'enum'
    })
    type:DocumentType;



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