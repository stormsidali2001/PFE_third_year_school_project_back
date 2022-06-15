import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { GraduationController } from "./graduation.controller";
import { GraduationService } from "./graduation.service";



@Module({
    imports:[TypeOrmModule.forFeature([])],
    controllers:[GraduationController],
    providers:[GraduationService,UserService]
})
export class Graduation{};