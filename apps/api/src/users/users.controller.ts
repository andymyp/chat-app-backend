import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { UserDto } from '@app/shared/dtos';
import { Request } from 'express';
import { JoiValidationPipe } from '../pipes/joi-validator.pipe';
import { updateValidation } from './users.validation';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAccessGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    const _id = req.user['_id'];
    const response = await this.userService.profile(_id);
    return response;
  }

  @UseGuards(JwtAccessGuard)
  @Patch('profile')
  @UsePipes(new JoiValidationPipe(updateValidation))
  async update(@Req() req: Request, @Body() data: Partial<UserDto>) {
    const _id = req.user['_id'];
    const response = await this.userService.update(_id, data);
    return response;
  }
}
