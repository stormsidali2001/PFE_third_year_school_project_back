import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeacherEntity } from "./teacher.entity";
import { CommitEntity } from "./commit.entity";

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

    @ManyToOne(type=>CommitEntity,c=>c.reviews)
    commit:CommitEntity;
}