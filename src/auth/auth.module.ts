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
import { JwtModule } from "@nestjs/jwt";
import { RefrechTokenStrategy } from "./strategies/refrech.token.strategy";
import { AccessTokenStrategy } from "./strategies/access.token.strategy";
import { LocalStrategy } from "./strategies/local.startegy";
import { PassportModule } from "@nestjs/passport";
import { SessionSerializer } from "./utils/SessionSerializer";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";



@Module({
    imports:[TypeOrmModule.forFeature([UserEntity,UserRepository,StudentEntity,TeamEntity,StudentRepository,RestPasswordTokenRepository]),
    JwtModule.register({}),PassportModule.register({session:true} /*for session */),
    UserModule

],
    controllers:[AuthController],
    providers:[AuthService,
        // AccessTokenStrategy,
        // RefrechTokenStrategy,
        LocalStrategy,
        SessionSerializer,
        UserService
    ]
})
export class Auth {}