import { Repository } from 'typeorm';
import { User } from './users.entity';
export declare class UsersService {
    private usersRepo;
    private privateKey;
    private publicKey;
    constructor(usersRepo: Repository<User>);
    getPublicKey(): string;
    create(email: string, role: string, status: string): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    delete(id: string): void;
    update(id: string, user: User): Promise<import("typeorm").UpdateResult>;
}
