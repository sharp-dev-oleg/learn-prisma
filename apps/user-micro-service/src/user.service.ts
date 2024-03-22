import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from '@app/database/user.repository';
import { WalletRepository } from '@app/database/wallet.repository';
import { PublicUser } from '@app/types/user';
import { hash } from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userRepository: UserRepository,
    private walletRepository: WalletRepository,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async search(query: string): Promise<PublicUser[]> {
    console.log('search', query);

    return this.userRepository.findByUsername(query);
  }

  async create(userData: User): Promise<PublicUser> {
    try {
      const users = await this.userRepository.countUsers(
        userData.username,
        userData.email,
      );
      if (users > 0) {
        throw 'Email or username is unavailable';
      }

      userData.password = await hash(userData.password, 10);
      const newUser = await this.prisma.user.create({ data: userData });

      await this.walletRepository.create({
        name: 'walletPW',
        balance: 500,
        userId: newUser.id,
      });

      Logger.log('createUser - Created user', newUser);

      return {
        id: newUser.id,
        username: newUser.username,
      };
    } catch (e) {
      Logger.log('UserService:create:error', e);
      throw new RpcException(e.toString());
    }
  }

  getByUsername(username: string): Promise<PublicUser> {
    Logger.log('getByUsername', username);
    return this.userRepository.getByUsername(username);
  }

  getByUsernameWithPassword(username: string): Promise<User> {
    Logger.log('getByUsernameWithPassword', username);
    return this.userRepository.getByUsernameWithPassword(username);
  }
}
