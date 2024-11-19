import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule, LoggerModule } from '@app/shared';

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
