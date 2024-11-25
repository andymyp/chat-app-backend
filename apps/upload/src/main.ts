import { NestFactory } from '@nestjs/core';
import { UploadModule } from './upload.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RmqService } from '@app/shared';
import { Queues } from '@app/shared/constants';

async function bootstrap() {
  const app = await NestFactory.create(UploadModule, {
    bufferLogs: true,
  });

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const rmqService = app.get<RmqService>(RmqService);

  app.useLogger(logger);
  app.connectMicroservice(rmqService.getOptions(Queues.UPLOAD));

  await app.startAllMicroservices();
}
bootstrap();
