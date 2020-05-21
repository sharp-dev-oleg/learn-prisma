import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PWModule } from './pw.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PWModule,
    {
      transport: Transport.TCP,
      options:{
        host:'localhost',
        port:3004
      }
    }
     
  );
  app.listen(() => console.log('PWMicroService is listening'));
}
bootstrap();
