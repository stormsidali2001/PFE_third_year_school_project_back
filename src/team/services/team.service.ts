import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApplyTeamsCompletionDTO } from "src/core/dtos/user.dto";
import { PromotionEntity } from "src/core/entities/promotion.entity";
import { StudentEntity } from "src/core/entities/student.entity";
import { TeamEntity } from "src/core/entities/team.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { getManager } from "typeorm";




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

            return applyTeamsCompletionPayload




        }catch(err){
            Logger.log(err,"UserService/applyTeamsCompletion")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }

    }
}