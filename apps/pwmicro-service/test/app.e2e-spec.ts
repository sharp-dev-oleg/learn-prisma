import { Transaction } from './../../../libs/database/src/models/Transaction';
import { Wailet } from './../../../libs/database/src/models/Wailet';
import { Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PWModule } from '../src/pw.module';
import { PWService } from '../src/pw.service';
describe('AppController (e2e)', () => {
  let app;
  let pwService: PWService;
  let wailetRepo: Repository<Wailet>;
  let transactionRepo: Repository<Transaction>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PWModule],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: {
        host: process.env.PW_MICRO_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.PW_MICRO_SERVICE_PORT) || 3004,
      },
    });

    pwService = moduleFixture.get<PWService>(PWService);
    wailetRepo = moduleFixture.get<Repository<Wailet>>(
      getRepositoryToken(Wailet),
    );
    transactionRepo = moduleFixture.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );

    await app.init();

    //  pwService.addCronJob();
  });

  afterAll(async () => {
    await app.close();
  });

  it('pw service should be defined', () => {
    expect(pwService).toBeDefined();
  });

  it('should complete money transfer', async (done) => {
    jest.spyOn(transactionRepo.manager, 'find').mockImplementation(() =>
      Promise.resolve([
        {
          id: 1,
          fromWailetId: 1,
          toWailetId: 2,
          status: 'NEW',
          amount: 5,
        },
      ]),
    );

    jest.spyOn(wailetRepo, 'findOne').mockImplementation(
      (req): Promise<Wailet> =>
        Promise.resolve({
          id: parseInt(req.id.toString()),
          name: `test${req.id}`,
          userId: parseInt(req.id.toString()),
          balance: 10,
        }),
    );
    jest
      .spyOn(wailetRepo.manager, 'save')
      .mockImplementation((wailet) => Promise.resolve(wailet));

    const saveMock = jest
      .spyOn(transactionRepo.manager, 'save')
      .mockImplementation((t) => Promise.resolve(t));
    jest
      .spyOn(transactionRepo.manager, 'transaction')
      .mockImplementation((callback: any) =>
        Promise.resolve(callback(transactionRepo.manager)),
      );
    jest
      .spyOn(wailetRepo.manager, 'transaction')
      .mockImplementation((callback: any) =>
        Promise.resolve(callback(wailetRepo.manager)),
      );
    await pwService.process();
    console.log(saveMock.mock.calls[1]);
    expect(saveMock.mock.calls.length).toBe(4);
    expect((saveMock.mock.calls[0][0] as any).status).toBe('COMPLETE');
    saveMock.mockClear();
    done();
  });

  it('should not complete money transfer', async (done) => {
    jest.spyOn(transactionRepo.manager, 'find').mockImplementation(() =>
      Promise.resolve([
        {
          id: 1,
          fromWailetId: 1,
          toWailetId: 2,
          status: 'NEW',
          amount: 5,
        },
      ]),
    );

    jest.spyOn(wailetRepo, 'findOne').mockImplementation(
      (req): Promise<Wailet> =>
        Promise.resolve({
          id: parseInt(req.id.toString()),
          name: `test${req.id}`,
          userId: parseInt(req.id.toString()),
          balance: 0,
        }),
    );
    jest
      .spyOn(wailetRepo.manager, 'save')
      .mockImplementation((wailet) => Promise.resolve(wailet));

    const saveMock = jest
      .spyOn(transactionRepo.manager, 'save')
      .mockImplementation((t: any) => Promise.resolve(t));
    jest
      .spyOn(transactionRepo.manager, 'transaction')
      .mockImplementation((callback: any) =>
        Promise.resolve(callback(transactionRepo.manager)),
      );
    jest
      .spyOn(wailetRepo.manager, 'transaction')
      .mockImplementation((callback: any) =>
        Promise.resolve(callback(wailetRepo.manager)),
      );
    await pwService.process();
    console.log(saveMock.mock.calls);
    expect(saveMock.mock.calls.length).toBe(2);
    expect((saveMock.mock.calls[0][0] as any).status).toBe('FAILED');
    saveMock.mockClear();
    done();
  });
});
