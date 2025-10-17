import { UsersService } from './users.service';
import type { Response } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(body: {
        email: string;
        role: string;
        status: string;
    }): Promise<import("./users.entity").User>;
    findAll(): Promise<import("./users.entity").User[]>;
    getPublicKey(): {
        key: string;
    };
    export(res: Response): Promise<void>;
    findOne(id: string): Promise<{
        user: string | undefined;
    }>;
    remove(id: string): string;
}
