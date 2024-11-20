import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  ConfigModule,
  DatabaseModule,
  LoggerModule,
  RmqModule,
} from '@app/shared';
import { User, UserSchema } from '@app/shared/schemas';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RmqModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
