import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session'
import * as passport from 'passport';

import {TypeormStore} from 'connect-typeorm'
import { getManager } from 'typeorm';
import { SessionEntity } from './core/entities/session.entity';
import { SessionAdapter } from './adapters/SessionAdapter';


async function bootstrap() {
  
    
    const port  = process.env.PORT ||8080 ;
    const app = await NestFactory.create(AppModule);
   
    app.enableCors({
        credentials:true,
        origin:['http://localhost:3000'],
        methods:['POST','GET']
    });
    const sessionRepository = getManager().getRepository(SessionEntity)
    const store = new TypeormStore({
        ttl: 86400
    }).connect(sessionRepository);
   
    const sessionMid = session({
        name:'NESTJS_SESSION_ID',
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized:false,
        store,
        cookie:{
            maxAge:6*60*60*1000,
            secure:false,
            httpOnly:true,
        }
    });

    
    // app.use(cookieParser())
    app.use(sessionMid)
    //for session with passport
    app.use(passport.initialize())
    app.use(passport.session())
    //for session with passport ---x
     app.useWebSocketAdapter(new SessionAdapter(sessionMid,app));
   
    app.useGlobalPipes(new ValidationPipe({transform:true}))
    await app.listen(port);
    Logger.log(`the server is running on http://localhost:${port}`,'Bootstrap');
  


}
bootstrap();
