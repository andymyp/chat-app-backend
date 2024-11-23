import { Module } from '@nestjs/common';
import { ConfigModule, LoggerModule } from '@app/shared';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule, LoggerModule, RedisModule, AuthModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
