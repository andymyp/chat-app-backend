import { Module } from '@nestjs/common';
import { ConfigModule, LoggerModule } from '@app/shared';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [ConfigModule, LoggerModule, RedisModule, AuthModule, UploadModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
