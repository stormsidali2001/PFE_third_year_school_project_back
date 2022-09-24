import * as passport from 'passport';
import {IoAdapter} from '@nestjs/platform-socket.io'
import {INestApplication} from '@nestjs/common'
export class SessionAdapter extends IoAdapter{
    private session:any ;

    constructor(session:any,app:INestApplication){
        super(app)
        this.session = session;
    }
    createIOServer(port: number, options?: any) {
        const server = super.createIOServer(port,options);
        const wrap = (middleware)=>(socket,next)=>middleware(socket.request,{},next)
        server.use((socket,next)=>{
            socket.data.username = ' '
            next();
        })

        server.use(wrap(this.session))
        server.use(wrap(passport.initialize()))
        server.use(wrap(passport.session()))
        
        console.log("hhhhhhhhhhhh")
        return server;
    }
}


