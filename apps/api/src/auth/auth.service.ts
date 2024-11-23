import { Queues } from '@app/shared/constants';
import { AuthDto, UserDto } from '@app/shared/dtos';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);

  constructor(@Inject(Queues.AUTH) private authClient: ClientProxy) {}

  async signUp(data: AuthDto) {
    const sended = this.authClient.send('sign-up', data);
    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.warn(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }

  async signIn(data: AuthDto) {
    const sended = this.authClient.send('sign-in', data);
    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.warn(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }

  async signInOAuth(data: UserDto) {
    const sended = this.authClient.send('sign-in-oauth', data);
    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.warn(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }

  async resendOtp(email: string) {
    const sended = this.authClient.send('resend-otp', { email });
    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.warn(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }

  async verify(email: string, otp: string) {
    const sended = this.authClient.send('verify', { email, otp });
    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.warn(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }

  async refreshToken(email: string, refreshToken: string) {
    const sended = this.authClient.send('refresh-token', {
      email,
      refreshToken,
    });

    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.warn(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }
}
