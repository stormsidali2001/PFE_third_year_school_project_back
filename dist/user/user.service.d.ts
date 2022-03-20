import { Repository } from "typeorm";
import { UserDTO, UserRO } from "./user.dto";
import { UserEntity } from "./user.entity";
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<UserEntity>);
    signin(data: UserDTO): Promise<UserRO>;
    signup(data: UserDTO): Promise<UserRO>;
    getUsers(): Promise<UserRO[]>;
}
