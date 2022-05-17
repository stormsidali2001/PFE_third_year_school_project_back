import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
export declare class SessionAdapter extends IoAdapter {
    private session;
    constructor(session: any, app: INestApplication);
    createIOServer(port: number, options?: any): any;
}
