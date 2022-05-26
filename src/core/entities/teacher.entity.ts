import {  Check, Column, Entity, JoinColumn, Long, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { EncadrementEntity } from "./encadrement.entity";
import { ResponsibleEntity } from "./responsible.entity";
import { TeamCommitReviewEntity } from "./team.commit.review.entity";
import { TeamTeacherChatMessage } from "./team.teacher.message.entity";
import { ThemeEntity } from "./theme.entity";
import { UserEntity } from "./user.entity";


@Entity('teacher')

export class TeacherEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @PrimaryColumn()
    ssn:string;

    @Column()
    firstName:string;
    
    @Column()
    speciality:string;


    @Column()
    lastName:string;

   

    //relations
    @OneToOne(type=>UserEntity) @JoinColumn()
    user:UserEntity

    @OneToMany(type=>TeamTeacherChatMessage,teamChatMessage=>teamChatMessage.ownerT)
    teamTeacherChatMessages:TeamTeacherChatMessage[];

    //to encadrement
    @OneToMany(type=>EncadrementEntity,encadrement=>encadrement.teacher)
    encadrements:EncadrementEntity[];

    //to team commit review 
    @OneToMany(type=>TeamCommitReviewEntity,teamCommitReview=>teamCommitReview.teacher)
    commitReviews:TeamCommitReviewEntity[];

    //to theme suggestion
    @OneToMany(type=>ThemeEntity,theme=>theme.suggestedByTeacher)
    suggestedThemes:ThemeEntity[];

    @OneToMany(type=>ResponsibleEntity,res=>res.teacher)
    teamsInCharge:ResponsibleEntity[];
    


}