import { Queues } from '@app/shared/constants';
import { UserDto } from '@app/shared/dtos';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(@Inject(Queues.USERS) private userClient: ClientProxy) {}

  async profile(_id: string) {
    const sended = this.userClient.send('get-user-id', { _id });
    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }

  async update(_id: string, data: Partial<UserDto>) {
    const sended = this.userClient.send('update-user', { ...data, _id });
    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }
}
