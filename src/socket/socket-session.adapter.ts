import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Server } from 'socket.io';
import * as sharedsession from 'express-socket.io-session'
import * as session from 'express-session'
import * as passport from 'passport';

/**
 * Enable session tokens for web sockets by using express-socket.io-session
 */
export class SocketSessionAdapter extends IoAdapter {
  private app : NestExpressApplication;

  constructor(app : NestExpressApplication) {
      super(app)
      this.app = app
  }

  createIOServer(port: number, options?: any): any {
    const server : Server = super.createIOServer(port, options);
    
    let sessionMd = session({
      name:'NESTJS_SESSION_ID',
      secret:process.env.SECRET,
      resave:false,
      saveUninitialized:false,
      cookie:{
          maxAge:6*60*60*1000,
          secure:false,
          httpOnly:true,
         
          
      }
  });
    
    this.app.use(sessionMd)
    server.use(sharedsession(sessionMd, {
      autoSave:true
    }))
    return server;
   
  }
}