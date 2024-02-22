import { AuthService } from './../src/auth.service';
import { AuthModule } from './../src/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth.controller';
import { Transport } from '@nestjs/microservices';
import { hash } from 'bcrypt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let authdata: { userId: number; accessToken: string };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    const app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_MICRO_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.AUTH_MICRO_SERVICE_PORT) || 3002,
      },
    });

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
    await app.init();
  });

  describe('root', () => {
    it('should login', async (done) => {
      const testUser = { id: 1, username: 'test', password: 'testpwd' };
      const criptedPass = await hash(testUser.password, 10);
      jest
        .spyOn(authService, 'validateUser')
        .mockImplementation(() =>
          Promise.resolve({ ...testUser, password: criptedPass }),
        );
      authdata = await authController.login(testUser);
      expect(authdata.userId).toEqual(testUser.id);
      done();
    });

    it('should is Logged In', async (done) => {
      const isLoggedIn = await authController.isLoggedIn({
        jwt: authdata.accessToken,
      });
      expect(isLoggedIn).toBeTruthy();
      done();
    });

    it('should is not Logged In', async (done) => {
      const isNotLoggedIn = await authController.isLoggedIn({
        jwt: 'wrong-token',
      });
      expect(isNotLoggedIn).toBeFalsy();
      done();
    });

    it('should return userdata', async (done) => {
      const userdata = await authController.getUserData({
        jwt: authdata.accessToken,
      });

      expect(userdata.username).toEqual('test');
      done();
    });
  });
});
