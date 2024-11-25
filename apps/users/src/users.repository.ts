import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AbstractRepository } from '@app/shared';
import { User } from '@app/shared/schemas';
import { UserDto } from '@app/shared/dtos';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }

  async findByEmail(email: string) {
    const document = await this.findOne({ email });
    return document;
  }

  async findById(_id: string) {
    const document = await this.findOne({ _id });
    return document;
  }

  async updateById(_id: Types.ObjectId, data: Partial<UserDto>) {
    const document = await this.findOneAndUpdate({ _id }, { $set: data });
    return document;
  }

  async updateRefreshToken(_id: Types.ObjectId, refreshToken: string | null) {
    const document = await this.findOneAndUpdate(
      { _id },
      { $set: { refreshToken } },
    );

    return document;
  }
}
