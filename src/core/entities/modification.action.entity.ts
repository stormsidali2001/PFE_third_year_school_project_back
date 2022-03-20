import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,ManyToOne} from 'typeorm';
import {TeamDocumentEntity} from './team.document.entity';
import { TeamEntity } from './team.entity';

export enum ModificationType {
    INSERTION = 'insertion',
    DELETION = 'deletion',
    UPDATE = 'update'
}
@Entity('modification_action')
export class ModificationActionEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({
        type:'enum',
        enum:ModificationType,
        default:ModificationType.INSERTION
    })
    type:ModificationType;

    @CreateDateColumn()
    createdAt:Date;

    //relations
    // to teamDocument
    @ManyToOne(type=>TeamDocumentEntity,teamDoucment=>teamDoucment.modificationActions)
    teamDocument:TeamDocumentEntity;

    //to team
    @ManyToOne(type=>TeamEntity,team=>team.modificationActions)
    team:TeamEntity;


}