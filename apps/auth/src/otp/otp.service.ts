import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import * as otpGenerator from 'otp-generator';
import { MailerService } from '@nestjs-modules/mailer';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OtpService {
  protected readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly mailerService: MailerService,
  ) {}

  async send(email: string) {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
    });

    const currentDate = new Date();

    await this.otpRepository.upsert(
      { email },
      {
        email: email,
        otpCode: otp,
        expiredAt: new Date(currentDate.getTime() + 10 * 60 * 1000),
      },
    );

    try {
      const sended = await this.mailerService.sendMail({
        to: email,
        subject: 'Chat App OTP Code',
        template: './otp',
        context: { otp },
      });

      return sended;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  async verify(email: string, otp: string) {
    const existsOtp = await this.otpRepository.findByEmail(email);

    if (!existsOtp || existsOtp.otpCode !== otp) {
      throw new RpcException(new UnauthorizedException('OTP Code is wrong'));
    }

    const currentDate = new Date();
    const expiredDate = new Date(existsOtp.expiredAt);

    if (expiredDate < currentDate) {
      throw new RpcException(new UnauthorizedException('OTP Code has expired'));
    }

    return existsOtp;
  }
}
