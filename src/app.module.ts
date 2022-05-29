import { Module } from '@nestjs/common';


import { Auth } from './auth/auth.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserEntity } from './core/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { StudentEntity } from './core/entities/student.entity';
import { TeacherEntity } from './core/entities/teacher.entity';

import { TeamEntity } from './core/entities/team.entity';
import { EntrepriseEntity } from './core/entities/entreprise.entity';
import { AdminEntity } from './core/entities/admin.entity';
import { InvitationEntity } from './core/entities/invitation.entity';
import { TeamChatMessageEntity } from './core/entities/team.chat.message.entity';
import { TeamTeacherChatMessage } from './core/entities/team.teacher.message.entity';
import { SurveyEntity } from './core/entities/survey.entity';
import { SurveyOptionEntity } from './core/entities/survey.option.entity';
import { AnnouncementDocumentEntity } from './core/entities/announcement.document.entity';
import { AnnouncementEntity } from './core/entities/announcement.entity';
import { ModificationActionEntity } from './core/entities/modification.action.entity';
import { EvaluationEntity } from './core/entities/evaluation.entity';
import { TeamDocumentEntity } from './core/entities/team.document.entity';
import { ThemeEntity } from './core/entities/theme.entity';
import { ThemeDocumentEntity } from './core/entities/theme.document.entity';
import { EncadrementEntity } from './core/entities/encadrement.entity';
import { MeetEntity } from './core/entities/meet.entity';
import { SurveyParticipantEntity } from './core/entities/survey.participant.entity';
import { PvMeetEntity } from './core/entities/pv.meet.entity';
import { TaskTodoPvMeetEntity } from './core/entities/pv.meet.task.todo.entity';
import { MeetAbsentEntity } from './core/entities/meet.absent.entity';
import { TeamCommitReviewEntity } from './core/entities/team.commit.review.entity';
import { NotificationEntity } from './core/entities/Notification.entity';
import { DiscusedPointEntity } from './core/entities/pv.meet.descused.point.entity';
import { RestPasswordTokenEntity } from './core/entities/resetPasswordToken.entity';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http.error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthenticatedGuard } from './common/guards/authentificatedGuard';
import { MessageModule } from './message/message.module';
import { SocketModule } from './socket/socket.module';
import { MulterModule } from '@nestjs/platform-express';
import { SessionEntity } from './core/entities/session.entity';
import { ConfigEntity } from './core/entities/config.entity';
import { PromotionEntity } from './core/entities/promotion.entity';
import { WishEntity } from './core/entities/wish.entity';
import { ResponsibleEntity } from './core/entities/responsible.entity';
import { DocumentTypeEntity } from './core/entities/document-types.entity';
import { CommitEntity } from './core/entities/commit.entity';
import { CommitDocumentEntity } from './core/entities/commit.document.entity';
import { SoutenanceEntity } from './core/entities/soutenance.entity';
import { Jury_of } from './core/entities/juryOf.entity';
import { SalleEntity } from './core/entities/salle.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
    type:"mysql",
    host:"localhost",
    port:3306,
    database:"pfe_db",
    username:"root",
    password:"root",
    synchronize:true,
    logging:true,
    entities:[UserEntity,
              StudentEntity,
              TeamEntity,
              EntrepriseEntity,
              TeacherEntity,
              AdminEntity,
              InvitationEntity,
              TeamChatMessageEntity,
              TeamTeacherChatMessage,
              SurveyEntity,
              SurveyOptionEntity,
              AnnouncementDocumentEntity,
              AnnouncementEntity,
              ModificationActionEntity,
              EvaluationEntity,
              TeamDocumentEntity,
              ThemeEntity,
              ThemeDocumentEntity,
              EncadrementEntity,
              SurveyParticipantEntity,
              PvMeetEntity,
              MeetEntity,
              TaskTodoPvMeetEntity,
              DiscusedPointEntity,
              MeetAbsentEntity,
              TeamDocumentEntity,
              TeamCommitReviewEntity,
              NotificationEntity,
              RestPasswordTokenEntity,
              SessionEntity,
              ConfigEntity,
              PromotionEntity,
              WishEntity,
              ResponsibleEntity,
              DocumentTypeEntity,
              CommitEntity,
              CommitDocumentEntity,
              SoutenanceEntity,
              Jury_of,
              SalleEntity
            
 
 
              
            ],

   
  
    


  

  }),
  Auth,
  UserModule,
  MessageModule,
  SocketModule
  ,
  ConfigModule.forRoot({isGlobal:true}), 
  ScheduleModule.forRoot(),
  MulterModule.register({
    dest: './upload',
  })
],
  controllers: [],
  providers: [
    {
    provide:APP_FILTER,
    useClass:HttpErrorFilter
     },
    {
      provide:APP_INTERCEPTOR,
      useClass:LoggingInterceptor
    },
    // {
    //   provide:APP_GUARD, // setting the accesToken guard as global so that all routes will passe through it
    //   useClass:AccessTokenGuard,
    // },
    {
      provide:APP_GUARD,
      useClass:AuthenticatedGuard
    }
    
],
})
export class AppModule {}
