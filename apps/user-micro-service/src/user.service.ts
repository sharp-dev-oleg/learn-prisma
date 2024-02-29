import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from '@app/database/user.repository';

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

  async search(query: string): Promise<User[]> {
    console.log('query1', query);
    const result = await this.userRepository.findByUsername(query);

    return result.map(({ id, name }) => ({ id, name }));
  }

  async create(userData: User) {
    return this.prisma.user.create({ data: userData });
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
  // async createUser(user: IUser): Promise<InsertResult> {
  //   try {
  //     const userEntity = this.userRepository.create(user);
  //
  //     const res = await this.userRepository.insert(userEntity);
  //
  //     const wailetEntity = this.wailetRepository.create({
  //       name: 'wailetPW',
  //       balance: 500,
  //       userId: userEntity.id,
  //     });
  //
  //     await this.wailetRepository.insert(wailetEntity);
  //
  //     Logger.log('createUser - Created user');
  //
  //     return res;
  //   } catch (e) {
  //     Logger.log(e);
  //     throw e;
  //   }
  // }
}
