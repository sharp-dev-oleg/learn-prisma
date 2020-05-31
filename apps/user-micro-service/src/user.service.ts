import { Wailet } from '../../../libs/database/src/models/Wailet';

import { IUser } from 'libs/database/src/models/user.interface';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { UserModel } from '../../../libs/database/src/models/user.model';

@Injectable()
export class UserService {
 
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
    @InjectRepository(Wailet)
    private wailetRepository: Repository<Wailet>,
  ) {}

  async getByUsername(data): Promise<IUser> {
    return await this.userRepository.findOne({ username: data.username });
  }

  async search(query: string): Promise<IUser[]> {
    
    const result = await this.userRepository.find({where:`username LIKE '${query}%'`});

    return result.map(({id,username})=>({id,username}));
  }

  async createUser(user: IUser): Promise<InsertResult> {
    try {
      const userEntity = this.userRepository.create(user);

      const res = await this.userRepository.insert(userEntity);

      const wailetEntity = this.wailetRepository.create({
        name: 'wailetPW',
        balance: 500,
        userId: userEntity.id,
      });

      await this.wailetRepository.insert(wailetEntity);

      Logger.log('createUser - Created user');

      return res;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }
}
