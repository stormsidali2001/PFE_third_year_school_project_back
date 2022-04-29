import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({usernameField:'email'});
  }

  async validate(email: string, password: string): Promise<any> {
    let user = null;
    try{
         user = await this.authService.signin({email,password})
         if (!user) {
            throw new UnauthorizedException();
          }

          return user; // passport creates a user property on the request object
    }catch(err){
        Logger.error(err,'LocalStrategy/validate')
        throw new HttpException(err,HttpStatus.UNAUTHORIZED);
    }
  
  
    
  }
}