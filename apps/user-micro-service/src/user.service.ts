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

      // const wailetEntity = this.wailetRepository.create({
      //   name: 'wailetPW',
      //   balance: 500,
      //   userId: userEntity.id,
      // });

      // await this.wailetRepository.insert(wailetEntity);

      Logger.log('createUser - Created user');

      return res;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  // constructor(
  //   private userRepository: Repository<UserModel>,
  //   @InjectRepository(Wailet)
  //   private wailetRepository: Repository<Wailet>,
  // ) {}
  //
  // async getByUsername(data): Promise<IUser> {
  //   Logger.log(data);
  //   return await this.userRepository.findOne({ username: data.username });
  // }
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
