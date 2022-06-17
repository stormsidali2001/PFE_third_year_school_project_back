import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApplyTeamsCompletionDTO } from "src/core/dtos/user.dto";
import { PromotionEntity } from "src/core/entities/promotion.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { TeamEntity } from "src/core/entities/team.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { StudentRepository } from "src/core/repositories/student.repository";
import { getConnection, getManager } from "typeorm";
import * as uniqid from 'uniqid'




@Injectable()
export class TeamService{

    async getTeamsStats(userId:string,promotionId:string){
        try{
            const manager = getManager();
            const user = await manager.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where("user.id = :userId",{userId})
            .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
            .getOne();
           
            if(!user){
                Logger.log("permission denied","TeamService/getTeamsStats")
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
            } 
          
            const promotion = await manager.getRepository(PromotionEntity)
            .createQueryBuilder('promotion')
            .where('promotion.id = :promotionId',{promotionId})
            .loadRelationCountAndMap("promotion.studentsWithoutATeam","promotion.students","pStudents",qb=>qb.where('pStudents.teamId is NULL'))
            .loadRelationCountAndMap("promotion.notCompleteTeams","promotion.teams","teams",   qb=>{
                const promotionQuery1 =  qb.subQuery()
                .select('minMembersInTeam')
                .from(PromotionEntity,'p')
                .where('p.id = :promotionId',{promotionId})
                .getQuery();
             

                const subQuery = qb.subQuery()
                .select('COUNT(st.id)')
                .from(StudentEntity,'st')
                .where('st.teamId = teams.id ')
                .getQuery();
                return qb.where(`${promotionQuery1} > (${subQuery})`)
            }
            
         
         )
            
            .getOne();
          
            if(!promotion){
                Logger.log("promotion not found","TeamService/getTeamsStats")
                throw new HttpException("promotion not found",HttpStatus.BAD_REQUEST)
            }  
            return promotion;
        }catch(err){
            Logger.log(err,"TeamService/getTeamsStats");
            throw new HttpException(err,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async completeTeams(userId:string,promotionId:string){
        try{
            const manager = getManager();
            const user = await manager.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where("user.id = :userId",{userId})
            .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
            .getOne();
    
            const promotion = await manager.getRepository(PromotionEntity)
            .createQueryBuilder('promotion')
            .where('promotion.id = :promotionId',{promotionId})
            .leftJoinAndSelect("promotion.teams","team")
            .leftJoinAndSelect('team.students','teamStudents')
            .leftJoinAndSelect("promotion.students","pstudents","pstudents.teamId IS NULL")
            .leftJoinAndSelect('team.teamLeader','teamLeader')
            .getOne();
            if(!user){
                Logger.log("permission denied","UserService/submitWishList")
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
            } 
            if(!promotion){
                Logger.log("promotion not found","UserService/submitWishList")
                throw new HttpException("promotion not found",HttpStatus.BAD_REQUEST)
            }  
    
            const teams = promotion.teams;
            /*----------------------------------------------------------------------------------------------------
            *  getting the extraStudents in teams
            */
           //---------------
                    //operation arrays
            const studentDeleted:{student:StudentEntity,team:TeamEntity}[] = [];
            const studentAdded:{student:StudentEntity,team:TeamEntity}[] = [];
            const newTeams:TeamEntity[] = [];
    
           //----------------
           let extraStudents = promotion.students;
           const INITIAL_TEAMS = [...teams];
           const INITIAL_EXTRA_STUDENTS = [...extraStudents];
    
           const MIN = promotion.minMembersInTeam;
           const MAX = promotion.maxMembersInTeam;
           const getStudentNotTeamLeader = (team:TeamEntity):StudentEntity=>{
            let i =0;
            const students = team.students
            while(i<students.length){
                const st:StudentEntity = students[i];
                if(st.id !== team.teamLeader.id){
                    return st;
                }
                i++;
            }
            return null;
           }
           teams.forEach((team,index,teamsArr)=>{
                while(team.students.length >MIN){
                    const st:StudentEntity = getStudentNotTeamLeader(team);
                    if(!st){ //impossible with the system if there is no issue
                        Logger.log("student expect team leader not found","UserService/completeTeams")
                        throw new HttpException("student expect team leader not found",HttpStatus.BAD_REQUEST)
                    }
                    extraStudents.push(st)
                    teamsArr[index].students = teamsArr[index].students.filter(s=>s.id !==st.id)
                    studentDeleted.push({student:{...st},team:{...team}});
                }
           })
    
           /*----------------------------------------------------------------------------------------------------
            *  adding extra students into teams with team.students.length <MIN
            */
          
                    console.log("adding extra students in teams with team.students.length <MIN")
                    let i = 0;
                    while(i<teams.length && extraStudents.length>0 ){
                        while( teams[i].students.length <MIN && extraStudents.length>0){
                          
                            const st:StudentEntity = extraStudents[extraStudents.length-1];
                            studentAdded.push({student:{...st},team:teams[i]});
                            teams[i].students.push({...st});
                            extraStudents = extraStudents.filter(s=>s.id !== st.id)   
                        }
    
                        i++;
                    }
            /*----------------------------------------------------------------------------------------------------
             *  Insert extra students into teams with team.students.length < Max
             */
            if(extraStudents.length >0){
                let i = 0;
                while(i<teams.length  ){
                    while( teams[i].students.length <MAX && extraStudents.length>0){
                        const st:StudentEntity = extraStudents[extraStudents.length-1]
                        studentAdded.push({student:{...st},team:teams[i]});
                        teams[i].students.push(st);
                        extraStudents = extraStudents.filter(s=>s.id !== st.id)   
                    }
                
                    i++;
                }
            }
           /*----------------------------------------------------------------------------------------------------
            *  now all teams are full
            *   create new teams for extra students
            */
            while(extraStudents.length >0){
    
                let newTeam:TeamEntity = manager.getRepository(TeamEntity).create({students:[]});
                while(newTeam.students.length <MAX && extraStudents.length >0){
                    const st:StudentEntity = extraStudents[extraStudents.length-1];
                    newTeam.students.push({...st})
                    extraStudents =extraStudents.filter(s=>s.id !== st.id)
                }
                newTeams.push(newTeam)
            }
    
    
            return {
                INITIAL_EXTRA_STUDENTS,
                studentAdded,
                studentDeleted,
                newTeams,
              
            }
          
    
        }catch(err){
            Logger.log(err,"UserService/completeTeams")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
            
        }
    }
    async applyTeamsCompletion(userId:string,promotionId:string,applyTeamsCompletionPayload:ApplyTeamsCompletionDTO){
        try{
            const manager = getManager();
            const user = await manager.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where("user.id = :userId",{userId})
            .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
            .getOne();
    
            const promotion = await manager.getRepository(PromotionEntity)
            .createQueryBuilder('promotion')
            .where('promotion.id = :promotionId',{promotionId})
            .getOne();
            if(!user){
                Logger.log("permission denied","UserService/submitWishList")
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
            } 
            if(!promotion){
                Logger.log("promotion not found","UserService/submitWishList")
                throw new HttpException("promotion not found",HttpStatus.BAD_REQUEST)
            }  

            const teamsAddSt = {};
            applyTeamsCompletionPayload.addedStudents.forEach(({teamId,studentId})=>{
                if(!teamsAddSt[teamId] ){
                    teamsAddSt[teamId]  = [];
                   

                }
                teamsAddSt[teamId].push(studentId);
              
            })
            const teamsDeleteSt = {};
            applyTeamsCompletionPayload.deletedStudents.forEach(({teamId,studentId})=>{
                if(!teamsDeleteSt[teamId] ){
                    teamsDeleteSt[teamId]  = [];
                }
                teamsDeleteSt[teamId].push(studentId);
              
            })

            await getConnection().transaction(async manager =>{
                const teamRepository = manager.getRepository(TeamEntity);
                const studentRepository =  manager.getRepository(StudentEntity);
             
          


                   /*
                        handling deletion

                 */
                        Object.keys(teamsDeleteSt).forEach(async teamId=>{
                            const studentsIds = teamsDeleteSt[teamId]; //contains an array of studentIds                         
                             await studentRepository
                                .createQueryBuilder("student")
                                .where('student.id in (:...studentsIds)',{studentsIds})
                                .update({team:null})
                                .execute();
                             }) 

                 /*
                        handling teamsAddSt

                 */
                Object.keys(teamsAddSt).forEach(async teamId=>{
                    const studentsIds = teamsAddSt[teamId]; //contains an array of studentIds
                    const team = await teamRepository
                                    .createQueryBuilder('team')
                                    .where('team.id = :teamId',{teamId})
                                    .getOne();
                    if(!team){

                          Logger.log("team not found when adding student to team","TeamService/applyTeamsCompletion")
                          throw new HttpException("team not found when adding student to team",HttpStatus.BAD_REQUEST)
                     }  
                     await studentRepository
                        .createQueryBuilder("student")
                        .where('student.id in (:...studentsIds)',{studentsIds})
                        .update({team})
                        .execute();
                }) 
               

                await manager.getRepository(PromotionEntity)
                .createQueryBuilder('promotion')
                .update()
                .set({allTeamsValidated:true})
                .where('promotion.id = :promotionId',{promotionId})
                .execute();
                


            })



                 /*
                        handling new teams

                 */
             const teamRepository = manager.getRepository(TeamEntity);
            const studentRepository =  manager.getRepository(StudentEntity);
          
          
            applyTeamsCompletionPayload.newTeams.forEach(async({students})=>{
            
                await getConnection().transaction(async manager=>{
                  
                    const teamRepository = manager.getRepository(TeamEntity);
                    const studentRepository =  manager.getRepository(StudentEntity);
                   
                    const newTeam = teamRepository.create({nickName:`team${uniqid()}`,promotion});
                    const newTeamDb = await teamRepository.save(newTeam)
                    const studentsIds = students.map(s=>s.studentId)
                  
                    
                         await studentRepository
                        .createQueryBuilder('student')
                        .where('student.id in (:...studentsIds)',{studentsIds})
                        .update()
                        .set({team:newTeamDb})
                        .execute();
                    
                        const randomlyChoosenTeamLeaderId = students[Math.floor(Math.random()*(students.length-1))].studentId;
                        const choosenStudent = await studentRepository
                        .createQueryBuilder('student')
                        .where('student.id = :studentId',{studentId:randomlyChoosenTeamLeaderId})
                        .getOne();

                        if(!choosenStudent){
                            Logger.log("choosen team leader not found","TeamService/applyTeamsCompletion")
                            throw new HttpException("choosen team leader not found",HttpStatus.BAD_REQUEST)
                        }
                        await teamRepository
                        .createQueryBuilder('team')
                        .where('team.id = :teamId',{teamId:newTeamDb.id})
                        .update()
                        .set({teamLeader:choosenStudent})
                        .execute();

                })
            })


            
                   

            return "success"
        }catch(err){
            Logger.log(err,"TeamService/applyTeamsCompletion")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }

    }
}