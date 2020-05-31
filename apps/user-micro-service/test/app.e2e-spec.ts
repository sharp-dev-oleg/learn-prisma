import { UserService } from '../src/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserModule } from '../src/user.module';
import { Transport } from '@nestjs/microservices';

describe('AppController (e2e)', () => {
  let app;
  let userService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options:{
        host: process.env.USER_MICRO_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_MICRO_SERVICE_PORT) || 3003
      }
    });

    userService = moduleFixture.get<UserService>(UserService);

    await app.init();
  });

  afterAll(async ()=>{
    await app.close();
  });

  it('userService should be definded', async (done) => {
      expect(userService).toBeDefined();
      done();
  });
});
