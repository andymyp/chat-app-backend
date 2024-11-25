import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UploadRepository } from './upload.repository';
import { extname } from 'path';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UploadService {
  protected readonly logger = new Logger(UploadService.name);

  constructor(private readonly uploadRepository: UploadRepository) {}

  async uploadAvatar(_id: string, file: Express.Multer.File) {
    const folder = 'avatars';
    const filename = _id + extname(file.originalname);

    try {
      await this.uploadRepository.delete(folder, filename);
    } catch (error) {}

    try {
      const upload = await this.uploadRepository.upload(file, folder, filename);
      return upload;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  async uploadGroup(code: string, file: Express.Multer.File) {
    const folder = 'groups';
    const filename = code + extname(file.originalname);

    try {
      await this.uploadRepository.delete(folder, filename);
    } catch (error) {}

    try {
      const upload = await this.uploadRepository.upload(file, folder, filename);
      return upload;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const folder = 'files';
    const filename = `${Date.now()}_${file.originalname}`;

    try {
      const upload = await this.uploadRepository.upload(file, folder, filename);

      return {
        folder: folder,
        filename: filename,
        type: file.mimetype,
        size: file.size,
        url: upload,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  async deleteFile(folder: string, filename: string) {
    try {
      const deleted = await this.uploadRepository.delete(folder, filename);
      return deleted;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }
}
