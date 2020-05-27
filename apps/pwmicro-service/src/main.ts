import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PWModule } from './pw.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PWModule,
    {
      transport: Transport.TCP,
      options:{
        host :process.env.PW_MICRO_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.PW_MICRO_SERVICE_PORT) || 3004
      }
    }
     
  );
  app.listen(() => console.log('PWMicroService is listening'));
}
bootstrap();
