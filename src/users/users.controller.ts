import {
  Controller,
  Body,
  Get,
  Delete,
  Put,
  Post,
  Param,
  Res,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { Response } from 'express';
import * as protobuf from 'protobufjs';

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
    const users = await this.usersService.findAll();

    const root = new protobuf.Root();

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

    root.define('myApp').add(UserProto).add(UsersProto);

    const UsersMessage = root.lookupType('Users');

    const buffer = UsersMessage.encode({ users }).finish();

    res.setHeader('Content-Type', 'application/x-protobuf');
    res.send(buffer);
  }

  @Get(':id')
  //   @HttpCode(HttpStatus.OK)
  async findOne(@Param() id: string) {
    const user = await this.usersService.getOne(id);

    return { user: user?.id };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param() id: string) {
    this.usersService.delete(id);

    return id;
  }

  //   @Put(':id')
  //   update(@Body() body: {email: string, role: string, status: string}, @Param() id: string) {
  //     const userData = (body.email, body.role, body.status)
  //     return this.usersService.update(userData, id)
  //   }
}
