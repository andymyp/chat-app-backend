import { Queues } from '@app/shared/constants';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UploadService {
  protected readonly logger = new Logger(UploadService.name);

  constructor(@Inject(Queues.UPLOAD) private uploadClient: ClientProxy) {}

  async uploadAvatar(_id: string, file: Express.Multer.File) {
    const sended = this.uploadClient.send('upload-avatar', { _id, file });
    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }

  async uploadGroup(code: string, file: Express.Multer.File) {
    const sended = this.uploadClient.send('upload-group', { code, file });
    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }

  async uploadFile(file: Express.Multer.File) {
    const sended = this.uploadClient.send('upload-file', { file });
    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }

  async deleteFile(folder: string, filename: string) {
    const sended = this.uploadClient.send('delete-file', { folder, filename });
    const response = await lastValueFrom(sended).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    });

    return response;
  }
}
