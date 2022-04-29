import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Request } from "express";

@Catch()
export class HttpErrorFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse();

        const status = exception?.getStatus() 
        
        const errorResponse = {
            code:status,
            timestamp:new Date().toLocaleDateString(),
            path:request.url,
            method:request.method,
            message:exception.message,


        }
        Logger.error(`${request.method} ${request.url} ${exception.message}`,JSON.stringify(errorResponse),'ExceptionErrorFilter')
        response.status(status).json(errorResponse)
    }
    
    
}