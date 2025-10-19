import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as crypto from 'crypto';
import { UserDto } from './dto/userDto.dto';

@Injectable()
export class UsersService {
  private privateKey: crypto.KeyObject;
  private publicKey: crypto.KeyObject;

  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  getPublicKey(): string {
    return this.publicKey.export({ type: 'pkcs1', format: 'pem' }).toString();
  }

  async create({ email, role, status }: UserDto) {
    const hashedEmail = crypto.createHash('sha384').update(email).digest('hex');

    const signature = crypto
      .sign('sha384', Buffer.from(hashedEmail), this.privateKey)
      .toString('base64');

    const users = await this.usersRepo.find();
    for (const u of users) {
      u.hashedEmail = crypto.createHash('sha384').update(u.email).digest('hex');
      await this.usersRepo.save(u);
    }

    const user = this.usersRepo.create({
      email,
      role,
      status,
      signature,
      hashedEmail,
    });

    return this.usersRepo.save(user);
  }

  findAll() {
    return this.usersRepo.find();
  }

  getOne(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  delete(id: string) {
    return this.usersRepo.delete(id);
  }

  async update(id: string, updateData: UserDto): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    const mergedUser = this.usersRepo.merge(user, updateData);

    return this.usersRepo.save(mergedUser);
  }
}
