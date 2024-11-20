import { Module } from '@nestjs/common';
import { RedisModule as Redis } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

@Module({
  imports: [
    Redis.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URI'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [{ limit: 10, ttl: 10 }],
        storage: new ThrottlerStorageRedisService(
          configService.get<string>('REDIS_URI'),
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RedisModule],
})
export class RedisModule {}
