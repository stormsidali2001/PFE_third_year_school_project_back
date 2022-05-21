import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
export declare class SocketSessionAdapter extends IoAdapter {
    private app;
    constructor(app: NestExpressApplication);
    createIOServer(port: number, options?: any): any;
}
