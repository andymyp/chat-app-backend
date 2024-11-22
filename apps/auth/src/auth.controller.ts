import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RmqService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthDto } from '@app/shared/dtos';

@Controller()
export class AuthController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('sign-up')
  async signUp(@Ctx() context: RmqContext, @Payload() data: AuthDto) {
    this.rmqService.ack(context);

    const document = await this.authService.signUp(data);
    return document;
  }

  @MessagePattern('sign-in')
  async signIn(@Ctx() context: RmqContext, @Payload() data: AuthDto) {
    this.rmqService.ack(context);

    const document = await this.authService.signIn(data);
    return document;
  }

  @MessagePattern('sign-in-oauth')
  async signInOAuth(
    @Ctx() context: RmqContext,
    @Payload() { email }: { email: string },
  ) {
    this.rmqService.ack(context);

    const document = await this.authService.signInOAuth(email);
    return document;
  }

  @MessagePattern('resend-otp')
  async resendOtp(
    @Ctx() context: RmqContext,
    @Payload() { email }: { email: string },
  ) {
    this.rmqService.ack(context);

    const document = await this.authService.resendOtp(email);
    return document;
  }

  @MessagePattern('verify')
  async verify(
    @Ctx() context: RmqContext,
    @Payload() { email, otp }: { email: string; otp: string },
  ) {
    this.rmqService.ack(context);

    const document = await this.authService.verify(email, otp);
    return document;
  }

  @MessagePattern('refresh-token')
  async refreshToken(
    @Ctx() context: RmqContext,
    @Payload() { email, refreshToken }: { email: string; refreshToken: string },
  ) {
    this.rmqService.ack(context);

    const document = await this.authService.refreshToken(email, refreshToken);
    return document;
  }
}
