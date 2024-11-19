import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RmqService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    bufferLogs: true,
  });

  const rmqService = app.get<RmqService>(RmqService);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.connectMicroservice(rmqService.getOptions('AUTH'));

  await app.startAllMicroservices();
}
bootstrap();
