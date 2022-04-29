import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    constructor(private reflector:Reflector){
        
    }
    async canActivate(context: ExecutionContext) {
        
        Logger.log("activate","AuthenticatedGuard/canActivate")
            const req =  context.switchToHttp().getRequest<Request>()
            const isPublic = this.reflector.getAllAndOverride('isPublic',[
                context.getHandler(), // in the function
                context.getClass() // in the class (example :userController)
            ])
    
            if(isPublic) return true;
            return req.isAuthenticated();
           
      
    }
  
}