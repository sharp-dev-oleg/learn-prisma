import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PWModule } from './pw.module';
import { PWService } from './pw.service';

async function bootstrap() {
  const options = {
    host: process.env.PW_MICRO_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.PW_MICRO_SERVICE_PORT) || 3004,
  };

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PWModule,
    {
      transport: Transport.TCP,
      options,
    },
  );
  await app.listen();
  console.log('PWMicroService is listening');
  const pwService = app.get<PWService>(PWService);
  pwService.addCronJob();
}
bootstrap();
