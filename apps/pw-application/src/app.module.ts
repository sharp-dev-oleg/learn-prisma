
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PwService } from './services/pw.service';
import { PWController } from './controllers/pw.controller';

@Module({
  imports: [ClientsModule.register([{
    name: 'AUTH_CLIENT',
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002,
    }
  }]),
  ClientsModule.register([{
    name: 'USER_CLIENT',
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3003,
    }
  }]),
  ClientsModule.register([{
    name: 'PW_CLIENT',
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3004,
    }
  }])],
  controllers: [AuthController, PWController],
  providers: [AuthService, PwService],
})
export class AppModule {}
