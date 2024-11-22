import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, LoggerModule, RmqModule } from '@app/shared';
import { Queues } from '@app/shared/constants';
import { OtpModule } from './otp/otp.module';
import { MailerModule } from './mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    RmqModule.register({ name: Queues.USERS }),
    OtpModule,
    MailerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
