import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options:{
        host:'127.0.0.1',
        port:3003
      }
    }
     
  );
  app.listen(() => console.log('UserMicroService is listening'));
}
bootstrap();
