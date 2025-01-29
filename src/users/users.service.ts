import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/users.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async getAll() {
    return this.userModel.findAll();
  }

  async findOne(id: string) {
    return await this.userModel.findOne({ where: { id } });
  }
}
