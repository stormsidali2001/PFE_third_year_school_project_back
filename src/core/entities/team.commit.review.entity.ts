import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeacherEntity } from "./teacher.entity";
import { TeamDocumentCommit } from "./team.document.commit.entity";

@Entity('team_commit_review')
export class TeamCommitReviewEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    description:string;

    @CreateDateColumn()
    createdAt:Date;

    @ManyToOne(type=>TeacherEntity,teacher=>teacher.commitReviews)
    teacher:TeacherEntity;
    @ManyToOne(type=>TeamDocumentCommit,teamDocumentCommit=>teamDocumentCommit.reviews)
    teamDocumentCommit:TeamDocumentCommit;
}