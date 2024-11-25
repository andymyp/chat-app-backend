import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { RmqModule } from '@app/shared';
import { Queues } from '@app/shared/constants';

@Module({
  imports: [RmqModule.register({ name: Queues.UPLOAD })],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
