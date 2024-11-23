import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
            winston.format.json(),
            winston.format.printf(({ timestamp, context, level, message }) => {
              return `${timestamp} [${context}] ${level}: ${message}`;
            }),
          ),
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
