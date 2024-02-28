import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const options = {
    host: process.env.USER_MICRO_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.USER_MICRO_SERVICE_PORT) || 3003,
  };

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options,
    },
  );
  await app.listen();
  console.log('UserMicroService is listening', options);
}
bootstrap();
