import { UserDTO } from "./user.dto";
import { UserService } from "./user.service";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUsers(): Promise<import("./user.dto").UserRO[]>;
    signin(data: UserDTO): Promise<import("./user.dto").UserRO>;
    signup(data: UserDTO): Promise<import("./user.dto").UserRO>;
}
