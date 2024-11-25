import { Module } from '@nestjs/common';
import { ConfigModule as Config, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        API_PORT: Joi.number().required(),
        FRONTEND_URL: Joi.string().required(),

        MONGODB_URI: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
        REDIS_URI: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

        SMTP_SERVER: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
        SMTP_USER: Joi.string().required(),
        SMTP_KEY: Joi.string().required(),
        SMTP_EMAIL: Joi.string().required(),

        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_CLIENT_EMAIL: Joi.string().required(),
        FIREBASE_PRIVATE_KEY: Joi.string().required(),
        FIREBASE_STORAGE_BUCKET: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
