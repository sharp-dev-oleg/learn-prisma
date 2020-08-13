import { Module, Logger } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath:'.env'}),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({envFilePath:'.env'})],
      useFactory: async (  configService: ConfigService) =>({
        secret: configService.get<string>('SICRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('EXPIRES_IN') }
      }),
      inject: [ConfigService],
    })
    
  ],
  providers: [
    { 
      provide: 'USER_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>{
        Logger.log(`user servuce h:${configService.get<string>('USER_MICRO_SERVICE_HOST')}:${configService.get<number>('USER_MICRO_SERVICE_PORT')}`);
       return ClientProxyFactory.create({
            transport: Transport.TCP,
            options: {
              host: configService.get<string>('USER_MICRO_SERVICE_HOST') ,
              port: configService.get<number>('USER_MICRO_SERVICE_PORT') ,
            }
          })
        
      }
    },
    ConfigService,
    AuthService, 
    LocalStrategy,
    JwtStrategy],
  controllers: [AuthController]
  
})
export class AuthModule {}
