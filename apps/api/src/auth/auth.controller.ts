import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, UserDto } from '@app/shared/dtos';
import { JoiValidationPipe } from '../pipes/joi-validator.pipe';
import {
  forgotPassValidation,
  resendOtpValidation,
  resetPassValidation,
  signInOAValidation,
  signInValidation,
  signUpValidation,
  verifyValidation,
} from './auth.validation';
import { Request } from 'express';
import { JwtResetGuard } from './guards/jwt-reset.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(new JoiValidationPipe(signUpValidation))
  async signUp(@Body() data: AuthDto) {
    const response = await this.authService.signUp(data);
    return response;
  }

  @Post('sign-in')
  @UsePipes(new JoiValidationPipe(signInValidation))
  async signIn(@Body() data: AuthDto) {
    const response = await this.authService.signIn(data);
    return response;
  }

  @Post('sign-in-oauth')
  @UsePipes(new JoiValidationPipe(signInOAValidation))
  async signInOAuth(@Body() data: UserDto) {
    const response = await this.authService.signInOAuth(data);
    return response;
  }

  @Post('resend-otp')
  @UsePipes(new JoiValidationPipe(resendOtpValidation))
  async resendOtp(@Req() req: Request) {
    const response = await this.authService.resendOtp(req.body.email);
    return response;
  }

  @Post('verify')
  @UsePipes(new JoiValidationPipe(verifyValidation))
  async verify(@Req() req: Request) {
    const response = await this.authService.verify(
      req.body.email,
      req.body.otp,
    );

    return response;
  }

  @Post('forgot-password')
  @UsePipes(new JoiValidationPipe(forgotPassValidation))
  async forgotPassword(@Req() req: Request) {
    const response = await this.authService.forgotPassword(req.body.email);
    return response;
  }

  @Patch('reset-password')
  @UsePipes(new JoiValidationPipe(resetPassValidation))
  @UseGuards(JwtResetGuard)
  async resetPassword(@Req() req: Request) {
    const response = await this.authService.resetPassword({
      email: req.user['email'],
      password: req.body.password,
    });

    return response;
  }

  @Get('refresh-token')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@Req() req: Request) {
    const response = await this.authService.refreshToken(
      req.user['email'],
      req.user['refreshToken'],
    );

    return response;
  }
}
