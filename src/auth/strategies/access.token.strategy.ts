import { ConfigService } from '@nestjs/config';
import {Strategy,ExtractJwt} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import { jwtPayload } from '../types/jwtPayload.type';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(config:ConfigService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:config.get<string>('ACCESS_TOKEN_SECRET')
        })
    }
    validate(payload:jwtPayload){
        return payload;
          /* this function will attach user to the request object request.user = payload
        */
    }
}