import { EntityRepository, Repository } from "typeorm";
import { StudentEntity } from "../entities/student.entity";

@EntityRepository(StudentEntity)
export class StudentRepository extends Repository<StudentEntity>{
    async getTeam(id:string){
       return  await this.createQueryBuilder('student').where('student.teamId = :id',{id}).getOne();
    }
    async getInvitationList(){
        return await this.createQueryBuilder('student').where('student.')
    }
    
}