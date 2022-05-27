import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommitDocumentEntity } from "./commit.document.entity";
import { TeamCommitReviewEntity } from "./team.commit.review.entity";
import { TeamEntity } from "./team.entity";

@Entity('commit')
export class CommitEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column()
    title:string;

    @Column()
    description:string;

    @CreateDateColumn()
    createdAt:Date;

    //relations

    @ManyToOne(type=>TeamEntity,team=>team.commits)
    team:TeamEntity;

    @OneToMany(type=>CommitDocumentEntity,cd=>cd.commit)
    documents:CommitDocumentEntity[];

    @OneToMany(type=>TeamCommitReviewEntity,teamCommitReviw=>teamCommitReviw.commit)
    reviews:TeamCommitReviewEntity[];


}