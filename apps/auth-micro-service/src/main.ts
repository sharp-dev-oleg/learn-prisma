import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_MICRO_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.AUTH_MICRO_SERVICE_PORT) || 3002,
      },
    },
  );
  app.listen(() => console.log('AuthMicroService is listening'));
}
bootstrap();
