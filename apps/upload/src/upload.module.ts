import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ConfigModule, LoggerModule, RmqModule } from '@app/shared';
import { UploadRepository } from './upload.repository';

@Module({
  imports: [ConfigModule, LoggerModule, RmqModule],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
})
export class UploadModule {}
