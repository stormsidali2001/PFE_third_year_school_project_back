import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { jwtPayload } from '../types/jwtPayload.type';
declare const AccessTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    constructor(config: ConfigService);
    validate(payload: jwtPayload): jwtPayload;
}
export {};
