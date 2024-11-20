import { Module } from '@nestjs/common';
import { ConfigModule as Config, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        API_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
        REDIS_URI: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
