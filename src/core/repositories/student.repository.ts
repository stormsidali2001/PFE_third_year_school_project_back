import { EntityRepository, Repository } from "typeorm";
import { StudentEntity } from "../entities/student.entity";

@EntityRepository(StudentEntity)
export class StudentRepository extends Repository<StudentEntity>{
    
}