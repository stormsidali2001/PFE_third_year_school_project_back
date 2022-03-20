import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeamCommitReviewEntity } from "./team.commit.review.entity";
import { TeamDocumentEntity } from "./team.document.entity";
import { TeamEntity } from "./team.entity";

@Entity('team_document_commit')
export class TeamDocumentCommit{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column()
    title:string;

    @Column()
    description:string;

    @CreateDateColumn()
    createdAt:Date;

    //relations

    @ManyToOne(type=>TeamEntity,team=>team.documentCommits)
    team:TeamEntity;

    @OneToMany(type=>TeamDocumentEntity,teamDocument=>teamDocument.teamDocumentCommit)
    documents:TeamDocumentCommit[];

    @OneToMany(type=>TeamCommitReviewEntity,teamCommitReviw=>teamCommitReviw.teamDocumentCommit)
    reviews:TeamCommitReviewEntity[];


}