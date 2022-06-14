import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ThemeToTeamDTO } from "src/core/dtos/user.dto";
import { TeamEntity } from "src/core/entities/team.entity";
import { ThemeEntity } from "src/core/entities/theme.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { WishEntity } from "src/core/entities/wish.entity";
import { getConnection, getManager } from "typeorm";



@Injectable()
export class ThemeAssignementService{
    async asignThemesToTeams(userId:string,promotionId:string,method:string){
        try{
            const manager = getManager();
            const user = manager.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where("user.id = :userId",{userId})
            .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
            .getOne();
    
            if(!user){
                Logger.log("permission denied","UserService/asignThemeToTeams")
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
            } 
          
    
    
            const Themes = await manager.getRepository(ThemeEntity)
            .createQueryBuilder('theme')
            .leftJoinAndSelect('theme.promotion','promotion')
            .where('promotion.id = :promotionId',{promotionId})
            .andWhere('theme.validated = true')
            .leftJoinAndSelect('theme.wishes','wish')
            .leftJoinAndSelect('wish.team','team')
            .orderBy('wish.order','ASC')
            .leftJoinAndSelect('team.students','student')
            .getMany();
    
              //
              
              const teams = await manager.getRepository(TeamEntity)
              .createQueryBuilder('team')
              .where(qb=>`team.id not in ${qb.subQuery()
              .select('wish.teamId').from(WishEntity,'wish').getQuery()}`)
             .getMany()
            if(teams.length >0){
                const newWishes = []
                let newThemes =JSON.parse(JSON.stringify(Themes));
                newThemes = newThemes.map(nth=>{
                  const newNth = {...nth}
                  delete newNth.promotion;
                  delete newNth.wishes;
                  delete newNth.team;
                  return newNth;
                })
             teams.forEach(team=>{
                newThemes.forEach((th,index)=>{
                  
                   
                     newWishes.push({
                         team,
                         order:index,
                         theme:th
                     })
                 })
             })
    
                await manager.getRepository(WishEntity)
                .save(newWishes)
    
            }
               
    
              //
    
          
    
            const af_team_to_th = {};
            const ignoreTeam = new Set()
            Themes.forEach(theme=>{
                af_team_to_th[theme.id] = []
               
                const {maxTeamForTheme} =theme.promotion;
              
    
                let wishes = theme.wishes;
              
                if(method === 'moy'){
                    wishes = theme.wishes.sort((a,b)=>{
                        const getMoyTeam = team =>{
                            let sum = 0;
                            team.students.forEach(st=>{
                                sum += st.moy;
                            })
                            return sum /team.students.length;
                        }
    
                        return (a.order === b.order)? getMoyTeam(a.team) - getMoyTeam(b.team):0;
                    })
    
                }else if(method === 'random'){
                    wishes = theme.wishes.sort((a,b)=>{
                      
    
                        return (a.order === b.order)? 0.5 - Math.random():0;
                    })
                }else if(method === 'time'){
                    wishes = theme.wishes.sort((a,b)=>{
                      
    
                        return (a.order === b.order)? (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()):0;
                    })
                }
              
                for(let k in wishes){
                    const wish =  wishes[k];
                    const {team,order} = wish;
                    if(ignoreTeam.has(team.id)){
                        continue;
                    }
                  
                    if(af_team_to_th[theme.id].length <maxTeamForTheme){
                        console.log("____________________")
                        console.log("maxTeamForTheme:",maxTeamForTheme)
                        console.log("af_team_to_th[theme.id].length:",af_team_to_th[theme.id].length)
                        af_team_to_th[theme.id].push(team)
                       ignoreTeam.add(team.id)
                    }
                    
                }
              
              
    
            })
    
            return Object.keys(af_team_to_th).map(el=>{
                const teams = af_team_to_th[el].map(team=>{
                    const newTeam = {...team}
                    delete newTeam.students 
                    return newTeam
                })
                const {title,id} = Themes.find(th=>th.id === el);
                return {
                    theme:{
                        id,
                        title
                    },
                    teams
                }
            });
    
    
    
        }catch(err){
        Logger.log(err,"UserService/asignThemeToTeams")
        throw new HttpException(err,HttpStatus.BAD_REQUEST)
        
    }
    
    }
    async applyThemesToTeamsAssignements(userId:string,data:ThemeToTeamDTO):Promise<any>{
        try{
            
            const manager = getManager();
            const user = manager.getRepository(UserEntity)
            .createQueryBuilder('user')
            .where("user.id = :userId",{userId})
            .andWhere("user.userType = :userType",{userType:UserType.ADMIN})
            .getOne();
    
            if(!user){
                Logger.log("permission denied","UserService/applyThemesToTeamsAssignements")
                throw new HttpException("permission denied",HttpStatus.BAD_REQUEST)
            } 
          
    
    
            //
            let fetchTeamIds:string[] = []
            let themeIds:string[] = []
            console.log(data,'77777777')
            for(let k in  data.themeToTeam){
                const el = data.themeToTeam[k]
                const {idTheme,teamIds} = el;
                console.log(el,'55555555555')
                themeIds.push(idTheme)
                fetchTeamIds = [...fetchTeamIds,...teamIds];
            }
           
    
          
    
            const themes = await manager.getRepository(ThemeEntity)
            .createQueryBuilder('theme')
            .where('theme.id IN (:...themeIds)',{themeIds})
            .getMany();
            const teams = await manager.getRepository(TeamEntity)
            .createQueryBuilder('team')
            .where('team.id IN (:...fetchTeamIds)',{fetchTeamIds})
            .getMany();
         
            if(themes.length !=themeIds.length){
                Logger.error("error in theme ids",'UserService/applyThemesToTeamsAssignements')
                throw new HttpException("error in theme ids",HttpStatus.BAD_REQUEST);
            }   
            if(teams.length !== fetchTeamIds.length){
                Logger.error("error in team ids",'UserService/applyThemesToTeamsAssignements')
                throw new HttpException("error in team ids",HttpStatus.BAD_REQUEST);
            }
    
            await getConnection().transaction(async manager =>{
                data.themeToTeam.forEach(async ({idTheme,teamIds})=>{
                    const theme = themes.find(el=>el.id === idTheme)
                    
                    teamIds.forEach(async teamId=>{
                        
                        await manager.getRepository(TeamEntity)
                        .createQueryBuilder('team')
                        .update()
                        .set({givenTheme:theme})
                        .where('team.id = :teamId',{teamId})
                        .execute()
                    })
                    
                })
    
            })
          
    
    
    
        }catch(err){
            Logger.error(err,'UserService/applyThemesToTeamsAssignements')
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        }
    }

}