import { UserModel } from './user.model';
import { IUser } from './user.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(  @InjectRepository(UserModel)
  private usersRepository: Repository<UserModel>){
    
  }

  async getByUsername(data): Promise<IUser> {
    return await this.usersRepository.findOne({ username: data.username });
  }
}
