import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  ConfigModule,
  DatabaseModule,
  LoggerModule,
  RmqModule,
} from '@app/shared';

@Module({
  imports: [ConfigModule, LoggerModule, DatabaseModule, RmqModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
