import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from '@app/shared';
import { UserDto } from '@app/shared/dtos';

@Controller()
export class UsersController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly usersService: UsersService,
  ) {}

  @MessagePattern('create-user')
  async create(@Ctx() context: RmqContext, @Payload() data: UserDto) {
    this.rmqService.ack(context);

    const document = await this.usersService.create(data);
    return document;
  }

  @MessagePattern('get-user')
  async get(
    @Ctx() context: RmqContext,
    @Payload() { email }: { email: string },
  ) {
    this.rmqService.ack(context);

    const document = await this.usersService.get(email);
    return document;
  }

  @MessagePattern('update-user')
  async update(@Ctx() context: RmqContext, @Payload() data: Partial<UserDto>) {
    this.rmqService.ack(context);

    const document = await this.usersService.update(data._id, data);
    return document;
  }

  @MessagePattern('update-token')
  async updateRefreshToken(
    @Ctx() context: RmqContext,
    @Payload()
    { _id, refreshToken }: { _id: string; refreshToken: string | null },
  ) {
    this.rmqService.ack(context);

    const document = await this.usersService.updateRefreshToken(
      _id,
      refreshToken,
    );

    return document;
  }
}
