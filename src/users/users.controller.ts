import {
  Controller,
  Body,
  Get,
  Delete,
  Post,
  Param,
  Res,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { Response } from 'express';
import * as protobuf from 'protobufjs';
import { UpdateUserDto } from './dto/userDto.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: { email: string; role: string; status: string }) {
    return this.usersService.create(body.email, body.role, body.status);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/public-key')
  getPublicKey() {
    return { key: this.usersService.getPublicKey() };
  }

  @Get('/export')
  async export(@Res() res: Response) {
    const users = (await this.usersService.findAll()).map((u) => ({
      id: String(u.id),
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt?.toISOString?.() || String(u.createdAt),
      signature: u.signature || '',
    }));

    const root = new protobuf.Root();
    const myApp = root.define('myApp');

    const UserProto = new protobuf.Type('User')
      .add(new protobuf.Field('id', 1, 'string'))
      .add(new protobuf.Field('email', 2, 'string'))
      .add(new protobuf.Field('role', 3, 'string'))
      .add(new protobuf.Field('status', 4, 'string'))
      .add(new protobuf.Field('createdAt', 5, 'string'))
      .add(new protobuf.Field('signature', 6, 'string'));

    const UsersProto = new protobuf.Type('Users').add(
      new protobuf.Field('users', 1, 'User', 'repeated'),
    );

    myApp.add(UserProto).add(UsersProto);

    const UsersMessage = root.lookupType('myApp.Users');
    const buffer = UsersMessage.encode({ users }).finish();

    res.setHeader('Content-Type', 'application/x-protobuf');
    return res.send(buffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.getOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return { user: user };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param() id: string) {
    this.usersService.delete(id);

    return id;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    return this.usersService.update(id, updateUserDto);
  }
}
