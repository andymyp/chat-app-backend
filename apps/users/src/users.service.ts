import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserDto } from '@app/shared/dtos';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(data: UserDto) {
    const exists = await this.usersRepository.findByEmail(data.email);

    if (exists && exists.status === 0) {
      const updated = await this.usersRepository.updateById(exists._id, {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      });

      return { email: updated.email };
    }

    if (exists && exists.status > 0) {
      throw new RpcException(new ConflictException('Email already exists'));
    }

    const created = await this.usersRepository.create({
      ...data,
      name: data.email.split('@')[0],
      password: await bcrypt.hash(data.password, 10),
    });

    return created;
  }

  async get(email: string) {
    const document = await this.usersRepository.findByEmail(email);
    return document;
  }

  async update(_id: Types.ObjectId, data: Partial<UserDto>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.usersRepository.updateById(_id, data);
    return updated;
  }

  async updateRefreshToken(_id: string, refreshToken: string | null) {
    if (refreshToken) {
      refreshToken = await bcrypt.hash(refreshToken, 10);
    }

    const updated = await this.usersRepository.updateRefreshToken(
      new Types.ObjectId(_id),
      refreshToken,
    );

    return updated;
  }
}
