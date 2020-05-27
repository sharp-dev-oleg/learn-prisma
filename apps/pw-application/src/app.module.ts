import { ConfigModule } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PwService } from './services/pw.service';
import { PWController } from './controllers/pw.controller';

@Module({
  imports: [
  ConfigModule,
  ClientsModule.register([{
    name: 'AUTH_CLIENT',
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_MICRO_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.AUTH_MICRO_SERVICE_PORT) || 3002,
    }
  }, 
  {
    name: 'USER_CLIENT',
    transport: Transport.TCP,
    options: {
      host: process.env.USER_MICRO_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.USER_MICRO_SERVICE_PORT) || 3003,
    }
  },
  {
    name: 'PW_CLIENT',
    transport: Transport.TCP,
    options: {
      host: process.env.PW_MICRO_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.PW_MICRO_SERVICE_PORT) || 3004,
    }
  }])],
  controllers: [AuthController, PWController],
  providers: [AuthService, PwService],
})
export class AppModule {}
