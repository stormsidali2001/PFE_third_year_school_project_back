import { CallHandler, ExecutionContext, Injectable ,NestInterceptor,Logger} from "@nestjs/common";
import { Observable } from "rxjs";
import {tap} from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext,next:CallHandler<any>): Observable<any>  {
        const request = context.switchToHttp().getRequest();
        const {method,url} = request;
        const now = Date.now();
       const call$ =  next.handle();
       
        return call$.pipe(
            tap(()=>Logger.log(`${method} ${url} request body:${JSON.stringify(request.body)} ${Date.now()-now}ms`,context.getClass().name))
        )
        
    }
    
}