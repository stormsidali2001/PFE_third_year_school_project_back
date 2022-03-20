import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { UserEntity } from "../core/entities/user.entity";
import { AuthService } from "./auth.service";
import { UserRepository } from "src/core/repositories/user.repository";
import { StudentEntity } from "src/core/entities/student.entity";
import { TeamEntity } from "src/core/entities/team.entity";
import { StudentRepository } from "src/core/repositories/student.repository";
import { RestPasswordTokenRepository } from "src/core/repositories/reset.password.token.repository";

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity,UserRepository,StudentEntity,TeamEntity,StudentRepository,RestPasswordTokenRepository])],
    controllers:[AuthController],
    providers:[AuthService]
})
export class Auth {}