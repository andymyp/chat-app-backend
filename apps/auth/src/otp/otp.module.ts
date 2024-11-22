import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { DatabaseModule } from '@app/shared';
import { Otp, OtpSchema } from '@app/shared/schemas';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
  ],
  providers: [OtpService, OtpRepository],
  exports: [OtpService],
})
export class OtpModule {}
