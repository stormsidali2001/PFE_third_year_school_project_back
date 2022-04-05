import { Injectable } from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'
@Injectable()
export class RefrechTokenGuard extends AuthGuard('jwt-refrech'){
    constructor(){
        super()
    }
}