import { Controller, Get } from '@nestjs/common';
import { UploadService } from './upload.service';
import { RmqService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class UploadController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly uploadService: UploadService,
  ) {}

  @MessagePattern('upload-avatar')
  async uploadAvatar(
    @Ctx() context: RmqContext,
    @Payload() { _id, file }: { _id: string; file: Express.Multer.File },
  ) {
    this.rmqService.ack(context);

    const response = await this.uploadService.uploadAvatar(_id, file);
    return response;
  }

  @MessagePattern('upload-group')
  async uploadGroup(
    @Ctx() context: RmqContext,
    @Payload() { code, file }: { code: string; file: Express.Multer.File },
  ) {
    this.rmqService.ack(context);

    const response = await this.uploadService.uploadGroup(code, file);
    return response;
  }

  @MessagePattern('upload-file')
  async uploadFile(
    @Ctx() context: RmqContext,
    @Payload() { file }: { file: Express.Multer.File },
  ) {
    this.rmqService.ack(context);

    const response = await this.uploadService.uploadFile(file);
    return response;
  }

  @MessagePattern('delete-file')
  async deleteFile(
    @Ctx() context: RmqContext,
    @Payload()
    { folder, filename }: { folder: string; filename: string },
  ) {
    this.rmqService.ack(context);

    const response = await this.uploadService.deleteFile(folder, filename);
    return response;
  }
}
