import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './otp/otp.service';
import { AuthDto, UserDto, UserResponseDto } from '@app/shared/dtos';
import { Queues } from '@app/shared/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly mailerService: MailerService,
    @Inject(Queues.USERS) private userClient: ClientProxy,
  ) {}

  async signUp(data: AuthDto) {
    const created = this.userClient.send('create-user', data);
    const user = await lastValueFrom(created).catch((err) => {
      if (err.status === 409) {
        throw new RpcException(err);
      } else {
        this.logger.error(err);
      }
    });

    await this.otpService.send(user.email);

    return { email: user.email };
  }

  async signIn(data: AuthDto) {
    const email = data.email;
    const password = data.password;

    const getUser = this.userClient.send('get-user', { email });
    const user = await lastValueFrom(getUser).catch((err) => {
      this.logger.error(err);
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new RpcException(
        new UnauthorizedException('Email or password wrong'),
      );
    }

    if (user.status === 0) {
      await this.otpService.send(user.email);
      return { status: 'not-verified', email: user.email };
    }

    const tokens = await this.generateTokens(user._id, user.email);

    const updateToken = this.userClient.send('update-token', {
      _id: user._id,
      refreshToken: tokens.refreshToken,
    });

    const updated = await lastValueFrom(updateToken).catch((err) => {
      this.logger.error(err);
    });

    const userResponse: UserResponseDto = {
      _id: updated._id,
      name: updated.name,
      about: updated.about,
      email: updated.email,
      avatar: updated.avatar,
      online: updated.online,
      status: updated.status,
    };

    return {
      user: userResponse,
      ...tokens,
    };
  }

  async signInOAuth(data: UserDto) {
    const email = data.email;
    const getUser = this.userClient.send('get-user', { email });
    let user = await lastValueFrom(getUser).catch((err) => {
      this.logger.error(err);
    });

    if (!user) {
      const created = this.userClient.send('create-user', {
        ...data,
        password: Math.floor(100000 + Math.random() * 900000).toString(),
      });

      user = await lastValueFrom(created).catch((err) => {
        this.logger.error(err);
      });
    }

    const tokens = await this.generateTokens(user._id, user.email);

    const updateToken = this.userClient.send('update-token', {
      _id: user._id,
      refreshToken: tokens.refreshToken,
    });

    const updated = await lastValueFrom(updateToken).catch((err) => {
      this.logger.error(err);
    });

    const userResponse: UserResponseDto = {
      _id: updated._id,
      name: updated.name,
      about: updated.about,
      email: updated.email,
      avatar: updated.avatar,
      online: updated.online,
      status: updated.status,
    };

    return {
      user: userResponse,
      ...tokens,
    };
  }

  async resendOtp(email: string) {
    const resend = this.otpService.send(email);
    return resend;
  }

  async verify(email: string, otp: string) {
    await this.otpService.verify(email, otp);

    const getUser = this.userClient.send('get-user', { email });
    const user = await lastValueFrom(getUser).catch((err) => {
      this.logger.error(err);
    });

    const tokens = await this.generateTokens(user._id, user.email);

    const updateUser = this.userClient.send('update-user', {
      ...user,
      status: 1,
      refreshToken: tokens.refreshToken,
    });

    const updated = await lastValueFrom(updateUser).catch((err) => {
      this.logger.error(err);
    });

    const userResponse: UserResponseDto = {
      _id: updated._id,
      name: updated.name,
      about: updated.about,
      email: updated.email,
      avatar: updated.avatar,
      online: updated.online,
      status: updated.status,
    };

    return {
      user: userResponse,
      ...tokens,
    };
  }

  async forgotPassword(email: string) {
    const getUser = this.userClient.send('get-user', { email });
    const user = await lastValueFrom(getUser).catch((err) => {
      this.logger.error(err);
    });

    if (!user) {
      throw new RpcException(new UnauthorizedException('Email not registered'));
    }

    const token = await this.jwtService.signAsync({ email });
    const link = `${this.config.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;

    try {
      const sended = await this.mailerService.sendMail({
        to: email,
        subject: 'Chat App Reset Password Request',
        template: './forgot-password',
        context: { link },
      });

      return sended;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  async resetPassword(data: AuthDto) {
    const email = data.email;
    const getUser = this.userClient.send('get-user', { email });
    const user = await lastValueFrom(getUser).catch((err) => {
      this.logger.error(err);
    });

    const tokens = await this.generateTokens(user._id, user.email);

    const updateUser = this.userClient.send('update-user', {
      _id: user._id,
      password: data.password,
      refreshToken: tokens.refreshToken,
    });

    const updated = await lastValueFrom(updateUser).catch((err) => {
      this.logger.error(err);
    });

    const userResponse: UserResponseDto = {
      _id: updated._id,
      name: updated.name,
      about: updated.about,
      email: updated.email,
      avatar: updated.avatar,
      online: updated.online,
      status: updated.status,
    };

    return {
      user: userResponse,
      ...tokens,
    };
  }

  async refreshToken(email: string, refreshToken: string) {
    const getUser = this.userClient.send('get-user', { email });
    const user = await lastValueFrom(getUser).catch((err) => {
      this.logger.error(err);
    });

    if (
      !user ||
      !user.refreshToken ||
      !(await bcrypt.compare(refreshToken, user.refreshToken))
    ) {
      throw new RpcException(new UnauthorizedException('Access Denied'));
    }

    const token = await this.jwtService.signAsync({
      _id: user._id,
      email: user.email,
    });

    return token;
  }

  async generateTokens(_id: string, email: string) {
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ _id, email }),
      this.jwtService.signAsync(
        { _id, email },
        {
          expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
    };
  }
}
