import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './otp/otp.service';
import { AuthDto, UserResponseDto } from '@app/shared/dtos';
import { Queues } from '@app/shared/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    @Inject(Queues.USERS) private userClient: ClientProxy,
  ) {}

  async signUp(data: AuthDto) {
    const created = this.userClient.send('create-user', data);
    const user = await lastValueFrom(created).catch((err) => {
      this.logger.warn(err);
    });

    await this.otpService.send(user.email);

    return { email: user.email };
  }

  async signIn(data: AuthDto) {
    const email = data.email;
    const password = data.password;

    const getUser = this.userClient.send('get-user', { email });
    const user = await lastValueFrom(getUser).catch((err) => {
      this.logger.warn(err);
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
      this.logger.warn(err);
    });

    const response = await Object.assign(new UserResponseDto(), updated);

    return {
      ...response,
      ...tokens,
    };
  }

  async signInOAuth(email: string) {
    const getUser = this.userClient.send('get-user', { email });
    let user = await lastValueFrom(getUser).catch((err) => {
      this.logger.warn(err);
    });

    if (!user) {
      const created = this.userClient.send('create-user', {
        email: email,
        password: Math.floor(100000 + Math.random() * 900000).toString(),
      });

      user = await lastValueFrom(created).catch((err) => {
        this.logger.warn(err);
      });
    }

    const tokens = await this.generateTokens(user._id, user.email);

    const updateToken = this.userClient.send('update-token', {
      _id: user._id,
      refreshToken: tokens.refreshToken,
    });

    const updated = await lastValueFrom(updateToken).catch((err) => {
      this.logger.warn(err);
    });

    const response = await Object.assign(new UserResponseDto(), updated);

    return {
      ...response,
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
      this.logger.warn(err);
    });

    const tokens = await this.generateTokens(user._id, user.email);

    const updateUser = this.userClient.send('update-user', {
      ...user,
      status: 1,
      refreshToken: tokens.refreshToken,
    });

    const updated = await lastValueFrom(updateUser).catch((err) => {
      this.logger.warn(err);
    });

    const response = await Object.assign(new UserResponseDto(), updated);

    return {
      ...response,
      ...tokens,
    };
  }

  async refreshToken(email: string, refreshToken: string) {
    const getUser = this.userClient.send('get-user', { email });
    const user = await lastValueFrom(getUser).catch((err) => {
      this.logger.warn(err);
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
