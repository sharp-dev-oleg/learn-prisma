import { UserService } from '../src/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../src/user.module';
import { Transport } from '@nestjs/microservices';
import { UserController } from '../src/user.controller';
import { UserRepository } from '@app/database/user.repository';

describe('AppController (e2e)', () => {
  let app;
  let userService: UserService;
  let userController: UserController;
  let userRepo: UserRepository;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: {
        host: process.env.USER_MICRO_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_MICRO_SERVICE_PORT) || 3003,
      },
    });

    userController = moduleFixture.get<UserController>(UserController);
    userService = moduleFixture.get<UserService>(UserService);
    userRepo = moduleFixture.get<UserRepository>(UserRepository);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('userService should be definded', async () => {
    expect(userService).toBeDefined();
  });

  it('should find users and return their data', async () => {
    const user = {
      id: 1,
      username: 'test',
    };

    const findSpy = jest
      .spyOn(userRepo, 'findByUsername')
      .mockResolvedValueOnce([user]);
    const userdata = await userController.search('test');

    expect(userdata).toEqual([user]);
    expect(findSpy).toBeCalledWith('test');
  });

  it('should return user data by username', async () => {
    const user = {
      id: 1,
      username: 'test',
    };

    const findSpy = jest
      .spyOn(userRepo, 'getByUsername')
      .mockResolvedValueOnce(user);
    const userdata = await userController.getByUserName('test');

    expect(userdata).toEqual(user);
    expect(findSpy).toBeCalledWith('test');
  });
});
