import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options:{
        host:'localhost',
        port:3003
      }
    }
     
  );
  app.listen(() => console.log('UserMicroService is listening'));
}
bootstrap();
