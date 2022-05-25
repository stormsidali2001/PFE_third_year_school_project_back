import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { jwtPayload } from '../types/jwtPayload.type';
import { jwtPayloadWithRefrechToken } from '../types/jwtPayloadWithRefrechToken';
import { Request } from 'express';
declare const RefrechTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class RefrechTokenStrategy extends RefrechTokenStrategy_base {
    constructor(config: ConfigService);
    validate(request: Request, payload: jwtPayload): jwtPayloadWithRefrechToken;
}
export {};
