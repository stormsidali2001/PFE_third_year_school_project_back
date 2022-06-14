import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { SurveyDto } from "src/core/dtos/user.dto";
import { StudentEntity } from "src/core/entities/student.entity";
import { SurveyEntity } from "src/core/entities/survey.entity";
import { SurveyOptionEntity } from "src/core/entities/survey.option.entity";
import { SurveyParticipantEntity } from "src/core/entities/survey.participant.entity";
import { UserService } from "src/user/user.service";
import { getManager } from "typeorm";



@Injectable()
export class TeamSurveyService{
    constructor(
        private readonly userService:UserService,
        private schedulerRegistry: SchedulerRegistry,
    ){}

    async createSurvey(userId:string ,survey:SurveyDto){
        const {title,description,options} = survey;
        let {period} = survey;
        if(Number.isNaN(period)){
            Logger.error("period is not a number",'UserService/createSurvey')
            throw new HttpException("period is not a number",HttpStatus.BAD_REQUEST);
        }
        
    
        if(period<1 && period >7){
            Logger.error("period must be between 1 and 7",'UserService/createSurvey');
            throw new HttpException("period must be between 1 and 7",HttpStatus.BAD_REQUEST);
        }
        period = period*24*60*60*1000;
        
    
        try{
            const manager = getManager();
            const studentRepository = manager.getRepository(StudentEntity);
            const student = await studentRepository.
            createQueryBuilder('student')
            .where('student.userId = :userId',{userId})
            .innerJoinAndSelect('student.team','team')
            .innerJoinAndSelect('team.teamLeader','teamLeader')
            .andWhere('teamLeader.id = student.id')
            .getOne()
            
          
            if(!student){       
                Logger.error("student | team   not found | student is not the teamLeader",'UserService/createSurvey')
                throw new HttpException("student not found",HttpStatus.BAD_REQUEST);
            }
       
          
            const surveyRepository = manager.getRepository(SurveyEntity);
            const surveyOptionRepository = manager.getRepository(SurveyOptionEntity);
            const survey = surveyRepository.create({title,description,period,team:student.team,close:false});
            const surveyOptions:SurveyOptionEntity[] = [];
            
            await surveyRepository.save(survey);
                for(let key in options){
                    const {description} = options[key];
                    const surveyOption = surveyOptionRepository.create({description,survey});
                    surveyOptions.push(surveyOption);
                }
                await surveyOptionRepository.save(surveyOptions);
                const surveyData = await surveyRepository.findOne({id:survey.id});
    
            this.userService._sendTeamNotfication(student.team.id,`a new survey has been created a survey with title: ${title}`);
            //running the crun job
          
            const job = new CronJob(new Date( new Date(surveyData.createdAt).getTime()+period),()=>{
                Logger.warn("survey period has ended",'UserService/createSurvey');
                surveyRepository.update({id:surveyData.id},{close:true});
                this.userService._sendTeamNotfication(student.team.id,`the survey with title: ${title}  ended`);
            })
            this.schedulerRegistry.addCronJob(`cron_Job_surveyEnd_${surveyData.id}`,job);
            job.start();
            return `survey sent with success to team: ${student.team.nickName} members`;
        }catch(err){
            Logger.error(err,'UserService/createSurvey')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
    
        } 
    }
    
    async getSurveys(userId:string){
        try{
            const manager =     getManager();
            const surveyRepo =   manager.getRepository(SurveyEntity);
            const surveys = await surveyRepo.createQueryBuilder('survey')
            .leftJoin('survey.team','team')
            .leftJoin('team.students','student')
            .where('student.userId = :userId',{userId})
            .leftJoinAndSelect('survey.participants','participants')
            // .leftJoinAndSelect("participants.student",'studentP')
            // .andWhere('participant.userId = :userId',{userId})
            .orderBy('survey.createdAt','DESC')
            .getMany()
        
          
            return surveys;
        }catch(err){
            Logger.error(err,'UserService/getSurveys')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
    
        }
    }
    async getSurvey(userId:string,surveyId:string){
        try{
            const manager =     getManager();
            const surveyRepo =   manager.getRepository(SurveyEntity);
            const survey = await surveyRepo.createQueryBuilder('survey')
            .where('survey.id = :surveyId',{surveyId})
            .leftJoin('survey.team','team')
            .leftJoin('team.students','student')
            .andWhere('student.userId = :userId',{userId})
            .leftJoinAndSelect('survey.participants','participant','participant.student.id = student.id')
            .leftJoinAndSelect('participant.answer','answer')
            .leftJoinAndSelect('survey.options','options')
            .loadRelationCountAndMap('options.answersCount','options.participations')
            .leftJoinAndSelect("participant.student",'participantStudent','participantStudent.id = student.id')
    
            .getOne()
          
          
            const response = {...survey};
            const participants = response.participants;
            delete response.participants;
            response['argument'] = participants?.length>=1 ?participants[0].argument:null;
            response['answer'] = participants?.length>=1 ?participants[0].answer:'';
            return response;
        }catch(err){
            Logger.error(err,'UserService/getSurvey')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
    
        }
    }

    async submitSurveyAnswer(userId:string,surveyId:string,optionId:string,argument:string){
        try{
            const manager = getManager();
            const studentRepository = manager.getRepository(StudentEntity);
            const student = await studentRepository.createQueryBuilder('student')
            .innerJoinAndSelect('student.team','team')
            .innerJoinAndSelect('team.surveys','surveys')
            .where('surveys.id = :surveyId',{surveyId})
            .innerJoinAndSelect('surveys.options','options')
            .andWhere('student.userId = :userId',{userId})
            .andWhere('options.id = :optionId',{optionId})
            .getOne();
         
           
            if(!student){   
                Logger.error("survey or student or option not found",'UserService/submitSurveyAnswer')  
                throw new HttpException("survey or student or option not found",HttpStatus.BAD_REQUEST);
            }
            
            const surveyParticipantRepository = manager.getRepository(SurveyParticipantEntity);
            
            const existingSurveyParticipant = await surveyParticipantRepository.createQueryBuilder('surveyParticipant')
            .innerJoin('surveyParticipant.survey','survey')
            .innerJoin('surveyParticipant.student','student')
            .innerJoinAndSelect('surveyParticipant.answer','answer')
            .andWhere('student.userId = :userId',{userId})
            .andWhere('survey.id = :surveyId',{surveyId})
            .getOne();
    
         
           
            const surveyParticipant = surveyParticipantRepository.create({survey:student.team.surveys[0],student:student,answer:student.team.surveys[0].options[0],argument});
    
          
          
            if(!existingSurveyParticipant){
                await surveyParticipantRepository.save(surveyParticipant);
                return "survey answered succesfully"
            }
        console.log( surveyParticipant.argument,"------------------",argument)
           if(surveyParticipant.answer.id === existingSurveyParticipant.answer.id && existingSurveyParticipant.argument === argument){
            Logger.error("you've already answered to the survey using that option or by providing the same argument",'UserService/submitSurvey')
            throw new HttpException("you've already answered to the survey using that option",HttpStatus.BAD_REQUEST);
           }
       
           await surveyParticipantRepository.update({id:existingSurveyParticipant.id},surveyParticipant);
            
          this.userService._sendTeamNotfication(student.team.id,`${student.firstName} ${student.lastName} a repondu au sondage : ${student.team.surveys[0].title}`)
          return "answer updated succesfully"
       
            
         
        }catch(err){
            Logger.error(err,'UserService/submitSurvey')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
    
        }
           
    }
    
    async getSurveyParticipantsArguments(userId:string,surveyId:string,optionId:string){
        try{
            const manager = getManager();
    
    
            return await manager.getRepository(SurveyParticipantEntity)
            .createQueryBuilder('participant')
            .where(qb=>{
                const subQuery = qb.subQuery()
                .select('survey.id')
                .from(StudentEntity,'student')
                .where('student.userId = :userId',{userId})
                .leftJoin('student.team','team')
                .leftJoin('team.surveys','survey')
                .andWhere('survey.id = :surveyId',{surveyId})
               .getQuery()
               return 'participant.surveyId IN '+subQuery;
            })
            .andWhere('participant.answerId = :optionId',{optionId})
            .leftJoinAndSelect('participant.student','student')
            .getMany()
    
            
    
        }catch(err){
            Logger.error(err,'UserService/getSurveyParticipantsArguments')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
    
        }
    }

}