import { Module } from '@nestjs/common';
import { ConfigModule, LoggerModule } from '@app/shared';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    RedisModule,
    AuthModule,
    UploadModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
