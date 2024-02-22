import { AuthService } from './../src/services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
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

  it('/registration (POST)', () => {
    const registerDate = { username: 'fresh', password: '123' };
    jest
      .spyOn(authService, 'registration')
      .mockImplementation(() => Promise.resolve({ id: 1 }));
    return request(app.getHttpServer())
      .post('/registration')
      .set('Accept', 'application/json')
      .send(registerDate)
      .expect(201);
  });

  it('/login (POST)', () => {
    const loginDate = { username: 'fresh', password: '123' };

    jest
      .spyOn(authService, 'login')
      .mockImplementation(() =>
        Promise.resolve({ userId: 1, accessToken: 'token' }),
      );
    return request(app.getHttpServer())
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginDate)
      .expect(201);
  });

  it('/userdata (GET)', () => {
    const token = 'token';
    jest.spyOn(authClient, 'send').mockImplementation(() => of(true));
    jest
      .spyOn(authService, 'getUserData')
      .mockImplementation(() =>
        Promise.resolve({ id: 1, username: 'test', exp: 123456 }),
      );
    return request(app.getHttpServer())
      .get('/userdata')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/wailets/:userId (GET)', () => {
    const token = 'token';
    jest.spyOn(authClient, 'send').mockImplementation(() => of(true));
    jest
      .spyOn(pwService, 'getWailets')
      .mockImplementation(() => Promise.resolve([]));
    return request(app.getHttpServer())
      .get('/wailets/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/recent (GET)', () => {
    const token = 'token';
    jest.spyOn(authClient, 'send').mockImplementation(() => of(true));
    jest
      .spyOn(pwService, 'getTransaction')
      .mockImplementation(() => Promise.resolve([]));
    return request(app.getHttpServer())
      .get('/recent')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/send (POST)', () => {
    const token = 'token';

    jest.spyOn(authClient, 'send').mockImplementation(() => of(true));
    jest
      .spyOn(pwService, 'sendTransaction')
      .mockImplementation(() => Promise.resolve());
    return request(app.getHttpServer())
      .post('/send')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 10,
        fromWailetId: 1,
        toWailetId: 2,
      })
      .expect(201);
  });

  it('/search?q=fr (GET)', () => {
    const token = 'token';
    jest.spyOn(authClient, 'send').mockImplementation(() => of(true));
    jest
      .spyOn(userService, 'search')
      .mockImplementation(() => Promise.resolve([]));
    return request(app.getHttpServer())
      .get('/search?q=fr')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
