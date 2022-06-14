import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ThemeDocDto } from "src/core/dtos/user.dto";
import { EntrepriseEntity } from "src/core/entities/entreprise.entity";
import { PromotionEntity } from "src/core/entities/promotion.entity";
import { TeacherEntity } from "src/core/entities/teacher.entity";
import { ThemeDocumentEntity } from "src/core/entities/theme.document.entity";
import { ThemeEntity } from "src/core/entities/theme.entity";
import { UserEntity, UserType } from "src/core/entities/user.entity";
import { getManager } from "typeorm";


@Injectable()
export class ThemeService {
//theme suggestions ------------------------------------------------------------------------------
async createThemeSuggestion(userId:string,title:string,description:string,documents:ThemeDocDto[],promotionId:string){

    try{
        const manager = getManager()
        const user = await manager.getRepository(UserEntity)
        .createQueryBuilder('user')
        .where('user.id = :userId',{userId})
        .getOne();

      
        
        if(!user){
            Logger.error("user not found",'UserService/createThemeSuggestion')
            throw new HttpException("user not found",HttpStatus.BAD_REQUEST);
        }

        const {userType} = user;
        if(userType !== UserType.TEACHER && userType !== UserType.ENTERPRISE ){
            Logger.error("you need to be either a teacher or an entreprise to submit a theme suggestion ",'UserService/createThemeSuggestion')
            throw new HttpException("you need to be either a teacher or an entreprise to submit a theme suggestion  ",HttpStatus.BAD_REQUEST);
        }
        const promotion = await manager.getRepository(PromotionEntity)
        .createQueryBuilder('promotion')
        .where('promotion.id = :promotionId',{promotionId})
        .getOne()

        if(!promotion){
            Logger.error("promotion not found",'UserService/createThemeSuggestion')
            throw new HttpException("promotion not found",HttpStatus.BAD_REQUEST);
        }
        let themeSuggestion;
        const themeRepository = manager.getRepository(ThemeEntity)
        if(userType === UserType.TEACHER){
            const teacher = await manager.getRepository(TeacherEntity)
            .createQueryBuilder('teacher')
            .where('teacher.userId = :userId',{userId})
            .getOne();
            themeSuggestion = themeRepository.create({title,description,suggestedByTeacher:teacher,promotion})

        }else if(userType === UserType.ENTERPRISE){
            const entreprise = await manager.getRepository(EntrepriseEntity)
            .createQueryBuilder('entrprise')
            .where('entrprise.userId = :userId',{userId})
            .getOne();
            themeSuggestion = themeRepository.create({title,description,suggestedByEntreprise:entreprise,promotion})


        }
        
     
        
        
        
      
         await themeRepository
        .createQueryBuilder()
        .insert()
        .values(themeSuggestion)
        .execute();

        

        const themeDocumentRepository =  manager.getRepository(ThemeDocumentEntity);
        const themeSuggestionsDocs:ThemeDocumentEntity[] = [];
        documents.forEach(doc=>{
            const themeSugDoc = themeDocumentRepository.create({name:doc.name,url:doc.url,theme:themeSuggestion});
            themeSuggestionsDocs.push(themeSugDoc)
        })
       
       await themeDocumentRepository.createQueryBuilder()
        .insert()
        .values(themeSuggestionsDocs)
        .execute();

      
       
    }catch(err){
        Logger.error(err,'UserService/createThemeSuggestion')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);

    }

}
async getThemeSuggestions(promotionId:string){
    try{
        const manager = getManager();
        const themeSuggestions:ThemeEntity[] = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where('theme.promotionId = :promotionId',{promotionId})
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher','theme.suggestedByTeacher IS NOT NULL')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise','theme.suggestedByEntreprise IS NOT NULL')
        .getMany()
       

       return themeSuggestions
        

       

       
    }catch(err){
        Logger.error(err,'UserService/getThemeSuggestions')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async getAllThemeSuggestions(){
    try{
        const manager = getManager();
        const themeSuggestions:ThemeEntity[] = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher','theme.suggestedByTeacher IS NOT NULL')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise','theme.suggestedByEntreprise IS NOT NULL')
        .leftJoinAndSelect('theme.promotion','promotion')
        .getMany()

        return themeSuggestions;

     
       
    }catch(err){
        Logger.error(err,'UserService/getAllThemeSuggestions')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async getThemeSuggestion(themeId:string){
    try{

        const manager = getManager();
        const themeSuggestion = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where("theme.id = :themeId",{themeId})
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise')
        .leftJoinAndSelect('theme.documents','documents')
        .leftJoinAndSelect('theme.promotion','promotion')
        .getOne()

       
        return themeSuggestion ;
    }catch(err){
        Logger.error(err,'UserService/getThemeSuggestion')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async validateThemeSuggestion(userId:string,themeId:string){
    try{
        const manager = getManager();

        const user = await manager.getRepository(UserEntity)
        .createQueryBuilder('user')
        .where('user.userType = :userType',{userType:UserType.ADMIN})
        .andWhere('user.id = :userId',{userId})
        .getOne()
        if(!user){
            Logger.error("permession denied",'UserService/validateThemeSuggestion')
            throw new HttpException("permession denied",HttpStatus.BAD_REQUEST);
        }

        await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .update()
        .set({validated:true})
        .where('theme.id = :themeId',{themeId})
        .execute();

    }catch(err){
        Logger.error(err,'UserService/validateThemeSuggestion')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
        
    }
}

//themes -------------------------------------------------------------------------------------------
async getAllThemes(){
    try{
        const manager = getManager();
        const themeSuggestions:ThemeEntity[] = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where('theme.validated = true')
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher','theme.suggestedByTeacher IS NOT NULL')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise','theme.suggestedByEntreprise IS NOT NULL')
        .leftJoinAndSelect('theme.promotion','promotion')
        .getMany()

        return themeSuggestions;

     
       
    }catch(err){
        Logger.error(err,'UserService/getAllThemeSuggestions')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}

async getThemes(promotionId:string){
    try{
        const manager = getManager();
        const themeSuggestions:ThemeEntity[] = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where('theme.validated = true')
        .andWhere('theme.promotionId = :promotionId',{promotionId})
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher','theme.suggestedByTeacher IS NOT NULL')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise','theme.suggestedByEntreprise IS NOT NULL')
        .getMany()
       

       return themeSuggestions
        

       

       
    }catch(err){
        Logger.error(err,'UserService/getThemes')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
async getTheme(themeId:string){
    try{

        const manager = getManager();
        const theme = await manager.getRepository(ThemeEntity)
        .createQueryBuilder('theme')
        .where("theme.id = :themeId",{themeId})
        .leftJoinAndSelect('theme.suggestedByTeacher','suggestedByTeacher')
        .leftJoinAndSelect('theme.suggestedByEntreprise','suggestedByEntreprise')
        .leftJoinAndSelect('theme.documents','documents')
        .leftJoinAndSelect('theme.promotion','promotion')
        .leftJoinAndSelect('theme.teams','teams')
        .leftJoinAndSelect('theme.encadrement','encadrement')
        .leftJoinAndSelect('encadrement.teacher','teacher')
        .leftJoinAndSelect('teacher.teamsInCharge','teamsInCharge')
        .leftJoinAndSelect('teamsInCharge.team','team')
        .getOne()

       
        return theme ;
    }catch(err){
        Logger.error(err,'UserService/getTheme')
        throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
}
}