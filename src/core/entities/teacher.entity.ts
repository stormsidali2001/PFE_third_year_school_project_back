import {  Check, Column, Entity, JoinColumn, Long, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { EncadrementEntity } from "./encadrement.entity";
import { NotificationEntity } from "./Notification.entity";
import { TeamCommitReviewEntity } from "./team.commit.review.entity";
import { TeamTeacherChatMessage } from "./team.teacher.message.entity";
import { ThemeSuggestionEntity } from "./theme.suggestion";
import { UserEntity } from "./user.entity";


@Entity('teacher')

export class TeacherEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @PrimaryColumn()
    code:string;

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column('date')
    dob:Date; 

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

    //to notification 
    @OneToMany(type=>NotificationEntity,notification=>notification.teacher)
    notifications:NotificationEntity[];

    //to theme suggestion
    @OneToMany(type=>ThemeSuggestionEntity,themeSuggestion=>themeSuggestion.teacher)
    themeSuggestions:ThemeSuggestionEntity[];
    

}