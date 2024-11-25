import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RmqModule } from '@app/shared';
import { Queues } from '@app/shared/constants';

@Module({
  imports: [RmqModule.register({ name: Queues.USERS })],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
