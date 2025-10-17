import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UpdateUserDto } from './dto/userDto.dto';
export declare class UsersService {
    private usersRepo;
    private privateKey;
    private publicKey;
    constructor(usersRepo: Repository<User>);
    getPublicKey(): string;
    create(email: string, role: string, status: string): Promise<User>;
    findAll(): Promise<User[]>;
    getOne(id: string): Promise<User | null>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
    update(id: string, updateData: UpdateUserDto): Promise<User>;
}
