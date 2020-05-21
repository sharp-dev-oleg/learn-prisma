import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  }])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
