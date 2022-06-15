import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ThemeToTeamDTO } from "src/core/dtos/user.dto";
import { EncadrementEntity } from "src/core/entities/encadrement.entity";
import { ResponsibleEntity } from "src/core/entities/responsible.entity";
import { TeacherEntity } from "src/core/entities/teacher.entity";
import { TeamEntity } from "src/core/entities/team.entity";
import { ThemeEntity } from "src/core/entities/theme.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { WishEntity } from "src/core/entities/wish.entity";
import { getConnection, getManager } from "typeorm";


@Injectable()
export class ThemeSupervisionService{
async encadrerTheme(userId:string,themeId:string,teacherId:string){
        try{
            const manager = getManager();
            const user = manager.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where("user.id = :userId",{userId})
            .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
            .getOne();
            if(!user){
                Logger.log("permission denied","UserService/encadrerTheme")
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
            } 

            const theme = await manager.getRepository(ThemeEntity)
            .createQueryBuilder('theme')
            .where('theme.id = :themeId',{themeId})
            .andWhere('theme.validated = true')
            .getOne();

            if(!theme){
                Logger.log("theme not found","UserService/encadrerTheme")
                throw new HttpException("theme not found",HttpStatus.BAD_REQUEST)

            }

            const teacher = await manager.getRepository(TeacherEntity)
            .createQueryBuilder('teacher')
            .where('teacher.id = :teacherId',{teacherId})
            .getOne();

            if(!teacher){
                Logger.log("teacher not found","UserService/encadrerTheme")
                throw new HttpException("teacher not found",HttpStatus.BAD_REQUEST)

            }
            const encadrement =   await manager.getRepository(EncadrementEntity)
            .createQueryBuilder('encadrement')
            .where('encadrement.teacherId = :teacherId and encadrement.themeId = :themeId',{teacherId,themeId})
            .getOne()
            if(encadrement){
                Logger.log("l'ensiegnant est deja un encadreur de ce theme","UserService/encadrerTheme")
                throw new HttpException("l'ensiegnant est deja un encadreur de ce theme",HttpStatus.BAD_REQUEST)
            }
            
            await manager.getRepository(EncadrementEntity)
            .createQueryBuilder('')
            .insert()
            .values({theme,teacher})
            .execute()
            

        }catch(err){
            
            Logger.log(err,"UserService/encadrerTheme")
            throw new HttpException(err,HttpStatus.BAD_REQUEST)
        }
}


async assignTeamsToTeacher(userId:string,teamIds:string[],teacherId:string){
    try{
        console.log(teacherId,'kkkkkkkkkkkk')
        const manager = getManager();
        const user = manager.getRepository(UserEntity)
        .createQueryBuilder('user')
        .where("user.id = :userId",{userId})
        .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
        .getOne();
        if(!user){
            Logger.log("permission denied","UserService/assignTeamToTeacher")
            throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
        } 

        const encadrement = await manager.getRepository(EncadrementEntity)
        .createQueryBuilder('encadrement')
        .where('encadrement.teacherId = :teacherId',{teacherId})
        .innerJoinAndSelect('encadrement.teacher','teacher')
        .innerJoinAndSelect('encadrement.theme','theme')
        .innerJoinAndSelect('theme.teams','team')
        .andWhere('team.id IN  (:...teamIds)',{teamIds})
        .getOne();    

        if(!encadrement || encadrement && encadrement.theme.teams.length < teamIds.length){
            Logger.log("l'ensiegnant doit encadrer le theme affecter a l'equipe","UserService/assignTeamsToTeacher")
            throw new HttpException("l'ensiegnant doit encadrer le theme affecter a l'equipe",HttpStatus.BAD_REQUEST)
        }

        const responsible = await manager.getRepository(ResponsibleEntity)
        .createQueryBuilder('responsible')
        .where('responsible.teamId in (:...teamIds)',{teamIds})
        .andWhere('responsible.teacherId = :teacherId',{teacherId})
        .getMany()
        if(responsible.length >0){
            Logger.log("l(es) equipe(s) sont deja sous la responsabilite de l'ensiegnant","UserService/assignTeamsToTeacher")
            throw new HttpException("l(es) equipe(s) sont deja sous la responsabilite de l'ensiegnant",HttpStatus.BAD_REQUEST)
        }
        await manager.getRepository(ResponsibleEntity)
        .save(
                encadrement.theme.teams.map(team=>{
                return {teacher:encadrement.teacher,team}
                })
        )
    }catch(err){ 
        Logger.log(err,"UserService/assignTeamToTeacher")
        throw new HttpException(err,HttpStatus.BAD_REQUEST)

    }
}

async getTeamsTeacherResponsibleFor(userId:string){
    try{
        const manager = getManager()

        return await manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .leftJoinAndSelect('team.responsibleTeachers','responsibleTeachers')
        .leftJoinAndSelect('responsibleTeachers.teacher','teacher')
        .where('teacher.userId = :userId',{userId})
        .getMany()

    }catch(err){
        Logger.error(err,'UserService/getTeamsTeacherResponsibleFor')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
}

async getTeamsTeacherResponsibleForWithMembers(userId:string,promotionId:string){
    try{
        const manager = getManager()


        const query =  manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .leftJoinAndSelect('team.responsibleTeachers','responsibleTeachers')
        .leftJoinAndSelect('responsibleTeachers.teacher','teacher')
        .where('teacher.userId = :userId',{userId})
        .leftJoinAndSelect('team.students','students')
        .leftJoinAndSelect('team.teamLeader','leader');
        if(promotionId!== 'all'){
            
          return   await query
          .andWhere('team.promotionId = :promotionId',{promotionId})
          .getMany()
        }else {
          
            return await query.getMany();
        }
      

    }catch(err){
        Logger.error(err,'UserService/getTeamsTeacherResponsibleForWithMembers')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }
}

async getTeamsithThemes(promotionId:string){
    try{
        const manager = getManager();
        let query =  manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .where('team.peutSoutenir = true')
        .innerJoinAndSelect('team.givenTheme','givenTheme')
        .leftJoinAndSelect('team.promotion','promotion')
       
        if(promotionId !=='all'){
            query = query.where('promotion.id = :promotionId',{promotionId})
        }

        const teams = await query.getMany()
        
        //@ts-ignore
        return teams.map(({nickName,givenTheme,membersCount,id,promotion})=>{
           Logger.error(nickName,promotion,"debug")
            return {
                id,
                pseudo:nickName,
                theme:givenTheme,
                nombre:membersCount,
                promotion:promotion.name,
                validated: membersCount >= promotion.minMembersInTeam && membersCount <=  promotion.maxMembersInTeam
            }
        });
    }catch(err){
        Logger.error(err,'UserService/getTeams')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }


}
async canSoutenir(userId:string,teamId:string){
    try{

        const manager = getManager();
        const user = await manager.getRepository(UserEntity)
        .createQueryBuilder('user')
        .where('user.id = :userId and user.userType = :userType',{userId,userType:UserType.TEACHER})
        .getOne()

        if(!user){
            Logger.error("permission denied",'UserService/canSoutenir')
            throw new HttpException("permission denied",HttpStatus.BAD_REQUEST);
        }
         const team = await manager.getRepository(TeamEntity)
         .createQueryBuilder('team')
         .where('team.id = :teamId and team.givenTheme IS NOT NULL',{teamId})
         .innerJoin('team.responsibleTeachers','responsibleTeachers')
         .innerJoin('responsibleTeachers.teacher','teacher')
         .andWhere('teacher.userId = :userId',{userId})
         .getOne();

         if(!team){
            Logger.error("team not found or theme",'UserService/canSoutenir')
            throw new HttpException("team not found or theme",HttpStatus.BAD_REQUEST);
         }

         await manager.getRepository(TeamEntity)
        .createQueryBuilder('team')
        .update()
        .where('team.id = :teamId',{teamId})
        .set({peutSoutenir:true})
        .execute()
    }catch(err){
        Logger.error(err,'UserService/canSoutenir')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
}