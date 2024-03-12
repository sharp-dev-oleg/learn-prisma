import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  private userClient: Prisma.UserDelegate;
  constructor(private prisma: PrismaService) {
    this.userClient = this.prisma.user;
  }

  countUsers(username: User['username'], email: User['email']) {
    return this.userClient.count({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }

  async getByUsername(username: User['username']): Promise<User> {
    return this.userClient.findFirst({
      where: {
        username,
      },
    });
  }

  async findByUsername(username: User['username']): Promise<User[]> {
    return this.userClient.findMany({
      where: {
        username: {
          contains: username,
        },
      },
    });
  }

  async create(userData: User) {
    return this.userClient.create({ data: userData });
  }
}
