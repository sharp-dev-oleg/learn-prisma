import { Test, TestingModule } from '@nestjs/testing';
import { PWController } from './pw.controller';
import { PWService } from './pw.service';

describe('PWController', () => {
  let appController: PWController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PWController],
      providers: [PWService],
    }).compile();

    appController = app.get<PWController>(PWController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
     // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
