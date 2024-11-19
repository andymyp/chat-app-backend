import { Module } from '@nestjs/common';
import { ConfigModule as Config, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // APP
        API_PORT: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigModule {}
