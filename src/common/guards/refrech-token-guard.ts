import {AuthGuard} from '@nestjs/passport'
export class RefrechTokenGuard extends AuthGuard('jwt-refrech'){
    constructor(){
        super()
    }
}