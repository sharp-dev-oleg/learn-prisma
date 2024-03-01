import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async getByUsername(username: User['username']): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        username,
      },
    });
  }

  async findByUsername(username: User['username']): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        username,
      },
    });
  }

  async create(userData: User) {
    return this.prisma.user.create({ data: userData });
  }
}
