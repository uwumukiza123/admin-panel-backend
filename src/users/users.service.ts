import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as crypto from 'crypto';

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

  async create(email: string, role: string, status: string) {
    const hash = crypto.createHash('sha384').update(email).digest('hex');

    const signature = crypto
      .sign('sha384', Buffer.from(hash), this.privateKey)
      .toString('base64');

    const user = this.usersRepo.create({ email, role, status, signature });
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

  update(id: string, user: User) {
    const getUser = this.usersRepo.findOne({ where: { id } });

    if (!getUser) {
      throw new NotFoundException(`User with ID${id} not found`);
    }
    return this.usersRepo.update(id, user);
  }
}
