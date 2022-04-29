import { Server } from 'ws';
import {Injectable} from "@nestjs/common";

@Injectable()
export class SocketService{
    public socket:Server = null;
}