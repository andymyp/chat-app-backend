import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, LoggerModule, RmqModule } from '@app/shared';
import { Queues } from '@app/shared/constants';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    RmqModule.register({ name: Queues.USERS }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
