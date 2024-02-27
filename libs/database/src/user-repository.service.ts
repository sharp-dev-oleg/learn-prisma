import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByUsername(
    username: User['name'],
  ): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        name: username
      },
    });
  }

  async create(userData: User) {
    return this.prisma.user.create({ data: userData });
  }
}