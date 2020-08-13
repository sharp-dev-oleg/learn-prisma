import { UserService } from './services/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Module, Logger } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ClientsModule, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { PwService } from './services/pw.service';
import { PWController } from './controllers/pw.controller';
import { UserController } from './controllers/user.controller';
import { GetWayController } from './controllers/getway.controller';

@Module({
  imports: [ConfigModule.forRoot({envFilePath:'.env'}),ClientsModule],
  controllers: [AuthController, PWController,UserController ],
  providers: [
    GetWayController,
    { 
      provide: 'USER_CLIENT',
      useFactory: (configService: ConfigService) =>{
        Logger.log(`user servuce h:${configService.get<string>('USER_MICRO_SERVICE_HOST')}:${configService.get<number>('USER_MICRO_SERVICE_PORT')}`);
      return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('USER_MICRO_SERVICE_HOST') ,
            port: configService.get<number>('USER_MICRO_SERVICE_PORT') ,
          }
        })},
        inject: [ConfigService]      
    },{ 
      provide: 'PW_CLIENT',
      useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('PW_MICRO_SERVICE_HOST') ,
            port: configService.get<number>('PW_MICRO_SERVICE_PORT') ,
          }
        }) ,
        inject: [ConfigService]     
    },{ 
      provide: 'AUTH_CLIENT',
      useFactory: (configService: ConfigService) => {
        Logger.log(`user servuce h:${configService.get<string>('AUTH_MICRO_SERVICE_HOST')}:${configService.get<number>('AUTH_MICRO_SERVICE_PORT')}`);
      return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_MICRO_SERVICE_HOST') ,
            port: configService.get<number>('AUTH_MICRO_SERVICE_PORT') ,
          }
        })  
      },
        inject: [ConfigService]    
    },AuthService, PwService,UserService],
})
export class AppModule {}
