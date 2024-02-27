import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.USER_MICRO_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_MICRO_SERVICE_PORT) || 3003,
      },
    },
  );
  await app.listen();
  console.log('UserMicroService is listening');
}
bootstrap();
