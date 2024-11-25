import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAccessGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const _id = req.user['_id'];
    const response = await this.uploadService.uploadAvatar(_id, file);
    return response;
  }

  @UseGuards(JwtAccessGuard)
  @Post('group')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGroup(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('code') code: string,
  ) {
    const response = await this.uploadService.uploadGroup(code, file);
    return response;
  }

  @UseGuards(JwtAccessGuard)
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const response = await this.uploadService.uploadFile(file);
    return response;
  }

  @UseGuards(JwtAccessGuard)
  @Post('delete')
  async deleteFile(@Req() req: Request) {
    const folder = req.body['folder'];
    const filename = req.body['filename'];

    const response = await this.uploadService.deleteFile(folder, filename);
    return response;
  }
}
