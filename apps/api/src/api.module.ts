import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule, LoggerModule, RmqModule } from '@app/shared';
import { Queues } from '@app/shared/constants';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    RmqModule.register({ name: Queues.AUTH }),
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
