import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from '@app/database/user.repository';
import { PublicUser } from '@app/types/user';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userRepository: UserRepository,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async search(query: string): Promise<PublicUser[]> {
    console.log('query1', query);
    const result = await this.userRepository.findByUsername(query);

    return result.map(({ id, username }) => ({ id, username }));
  }

  async create(userData: User): Promise<User> {
    try {
      userData.password = await hash(userData.password, 10);
      const res = this.prisma.user.create({ data: userData });

      // const walletEntity = this.walletRepository.create({
      //   name: 'walletPW',
      //   balance: 500,
      //   userId: userEntity.id,
      // });

      // await this.walletRepository.insert(walletEntity);

      Logger.log('createUser - Created user');

      return res;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  getByUsername(username: string): Promise<User> {
    Logger.log('getByUsername', username);
    return this.userRepository.getByUsername(username);
  }

  //
  // async search(query: string): Promise<IUser[]> {
  //   const result = await this.userRepository.find({
  //     where: `username LIKE '${query}%'`,
  //   });
  //
  //   return result.map(({ id, username }) => ({ id, username }));
  // }
  //
}
