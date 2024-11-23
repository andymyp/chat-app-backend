import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AbstractRepository } from '@app/shared';
import { Otp } from '@app/shared/schemas';
import { OtpDto } from '@app/shared/dtos';

@Injectable()
export class OtpRepository extends AbstractRepository<Otp> {
  protected readonly logger = new Logger(OtpRepository.name);

  constructor(@InjectModel(Otp.name) otpModel: Model<Otp>) {
    super(otpModel);
  }

  async upsertOtp(email: string, data: OtpDto) {
    const document = await this.upsert({ email }, data);
    return document;
  }

  async findByEmail(email: string) {
    const document = await this.findOne({ email });
    return document;
  }
}
