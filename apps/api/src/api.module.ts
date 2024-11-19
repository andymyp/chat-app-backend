import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule, LoggerModule, RmqModule } from '@app/shared';

@Module({
  imports: [ConfigModule, LoggerModule, RmqModule.register({ name: 'AUTH' })],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
