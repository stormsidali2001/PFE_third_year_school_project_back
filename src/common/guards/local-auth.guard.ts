import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const result = (await super.canActivate(context)) as boolean;
            const req =  context.switchToHttp().getRequest()
            Logger.log("activate","LocalAuthGuard/canActivate")
            await super.logIn(req)
        return result;
      
    }
  
}