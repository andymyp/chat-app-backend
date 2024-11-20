import { Module } from '@nestjs/common';
import { ConfigModule, LoggerModule, RmqModule } from '@app/shared';
import { RedisModule } from './redis/redis.module';
import { Queues } from '@app/shared/constants';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    RedisModule,
    RmqModule.register({ name: Queues.AUTH }),
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
