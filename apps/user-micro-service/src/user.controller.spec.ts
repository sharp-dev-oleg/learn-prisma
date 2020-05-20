import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
     // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
