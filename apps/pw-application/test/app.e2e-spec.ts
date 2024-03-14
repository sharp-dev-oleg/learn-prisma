import { AuthService } from '../src/services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { of } from 'rxjs';
import { PwService } from '../src/services/pw.service';
import { UserService } from '../src/services/user.service';
import { Transport } from '@nestjs/microservices';
import { INestApplication } from '@nestjs/common';

describe('app (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let pwService: PwService;
  let userService: UserService;
  let authClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: process.env.USER_MICRO_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_MICRO_SERVICE_PORT) || 3003,
      },
    });

    app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: process.env.PW_MICRO_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.PW_MICRO_SERVICE_PORT) || 3004,
      },
    });

    app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_MICRO_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.AUTH_MICRO_SERVICE_PORT) || 3002,
      },
    });

    authService = moduleFixture.get<AuthService>(AuthService);
    pwService = moduleFixture.get<PwService>(PwService);
    userService = moduleFixture.get<UserService>(UserService);
    authClient = moduleFixture.get('AUTH_CLIENT');
    await app.startAllMicroservicesAsync();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/users (POST)', () => {
    const registerDate = { username: 'fresh', password: '123' };
    jest
      .spyOn(authService, 'registration')
      .mockImplementation(() => Promise.resolve({ id: 1 }));
    return request(app.getHttpServer())
      .post('/users')
      .set('Accept', 'application/json')
      .send(registerDate)
      .expect(201);
  });

  it('/sessions/create (POST)', () => {
    const loginDate = { username: 'fresh', password: '123' };

    jest
      .spyOn(authService, 'login')
      .mockImplementation(() =>
        Promise.resolve({ userId: 1, accessToken: 'token' }),
      );
    return request(app.getHttpServer())
      .post('/sessions/create')
      .set('Accept', 'application/json')
      .send(loginDate)
      .expect(201);
  });

  it('/api/protected/user-info (GET)', () => {
    const token = 'token';
    jest.spyOn(authClient, 'send').mockImplementation(() => of(true));
    jest
      .spyOn(authService, 'getUserData')
      .mockImplementation(() =>
        Promise.resolve({ id: 1, username: 'test', exp: 123456 }),
      );
    return request(app.getHttpServer())
      .get('/api/protected/user-info')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/wallets/:userId (GET)', () => {
    const token = 'token';
    jest.spyOn(authClient, 'send').mockImplementation(() => of(true));
    jest
      .spyOn(pwService, 'getWallets')
      .mockImplementation(() => Promise.resolve([]));
    return request(app.getHttpServer())
      .get('/wallets/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/api/protected/transactions (GET)', () => {
    const token = 'token';
    jest.spyOn(authClient, 'send').mockImplementation(() => of(true));
    jest
      .spyOn(pwService, 'getTransaction')
      .mockImplementation(() => Promise.resolve([]));
    return request(app.getHttpServer())
      .get('/api/protected/transactions')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/api/protected/transactions (POST)', () => {
    const token = 'token';

    jest.spyOn(authClient, 'send').mockImplementation(() => of(true));
    jest
      .spyOn(pwService, 'sendTransaction')
      .mockImplementation(() => Promise.resolve());
    return request(app.getHttpServer())
      .post('/api/protected/transactions')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 10,
        fromWalletId: 1,
        toWalletId: 2,
      })
      .expect(201);
  });

  it('/api/protected/users/list?q=fr (GET)', () => {
    const token = 'token';
    jest.spyOn(authClient, 'send').mockImplementation(() => of(true));
    jest
      .spyOn(userService, 'search')
      .mockImplementation(() => Promise.resolve([]));
    return request(app.getHttpServer())
      .post('/api/protected/users/list?q=fr')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
  });
});
