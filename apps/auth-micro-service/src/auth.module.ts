import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath:'.env'}),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({envFilePath:'.env'})],
      useFactory: async (  configService: ConfigService) =>{ 
        console.log({secret: configService.get<string>('SICRET_KEY')})
        return ({
        secret: configService.get<string>('SICRET_KEY'),
        signOptions: { expiresIn: '6000s' }
      });},
      inject: [ConfigService],
    }),
    
    ClientsModule.register([{
    name: 'USER_CLIENT',
    transport: Transport.TCP,
    options: {
      host: process.env.USER_MICRO_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.USER_MICRO_SERVICE_PORT) || 3003,
    }
  }])],
  providers: [ConfigService,AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
  
})
export class AuthModule {}
