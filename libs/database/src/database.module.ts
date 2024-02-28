import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from '@app/database/user-repository.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'database.env',
    }),
  ],
  providers: [PrismaService, UserRepository],
  exports: [PrismaService, UserRepository],
})
export class DatabaseModule {}
