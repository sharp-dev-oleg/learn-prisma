import { Transaction } from './../../../libs/database/src/models/Transaction';
import { Wallet } from './../../../libs/database/src/models/Wallet';
import { Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PWModule } from '../src/pw.module';
import { PWService } from '../src/pw.service';
describe('AppController (e2e)', () => {
  let app;
  let pwService: PWService;
  let walletRepo: Repository<Wallet>;
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
    walletRepo = moduleFixture.get<Repository<Wallet>>(
      getRepositoryToken(Wallet),
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
          fromWalletId: 1,
          toWalletId: 2,
          status: 'NEW',
          amount: 5,
        },
      ]),
    );

    jest.spyOn(walletRepo, 'findOne').mockImplementation(
      (req): Promise<Wallet> =>
        Promise.resolve({
          id: parseInt(req.id.toString()),
          name: `test${req.id}`,
          userId: parseInt(req.id.toString()),
          balance: 10,
        }),
    );
    jest
      .spyOn(walletRepo.manager, 'save')
      .mockImplementation((wallet) => Promise.resolve(wallet));

    const saveMock = jest
      .spyOn(transactionRepo.manager, 'save')
      .mockImplementation((t) => Promise.resolve(t));
    jest
      .spyOn(transactionRepo.manager, 'transaction')
      .mockImplementation((callback: any) =>
        Promise.resolve(callback(transactionRepo.manager)),
      );
    jest
      .spyOn(walletRepo.manager, 'transaction')
      .mockImplementation((callback: any) =>
        Promise.resolve(callback(walletRepo.manager)),
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
          fromWalletId: 1,
          toWalletId: 2,
          status: 'NEW',
          amount: 5,
        },
      ]),
    );

    jest.spyOn(walletRepo, 'findOne').mockImplementation(
      (req): Promise<Wallet> =>
        Promise.resolve({
          id: parseInt(req.id.toString()),
          name: `test${req.id}`,
          userId: parseInt(req.id.toString()),
          balance: 0,
        }),
    );
    jest
      .spyOn(walletRepo.manager, 'save')
      .mockImplementation((wallet) => Promise.resolve(wallet));

    const saveMock = jest
      .spyOn(transactionRepo.manager, 'save')
      .mockImplementation((t: any) => Promise.resolve(t));
    jest
      .spyOn(transactionRepo.manager, 'transaction')
      .mockImplementation((callback: any) =>
        Promise.resolve(callback(transactionRepo.manager)),
      );
    jest
      .spyOn(walletRepo.manager, 'transaction')
      .mockImplementation((callback: any) =>
        Promise.resolve(callback(walletRepo.manager)),
      );
    await pwService.process();
    console.log(saveMock.mock.calls);
    expect(saveMock.mock.calls.length).toBe(2);
    expect((saveMock.mock.calls[0][0] as any).status).toBe('FAILED');
    saveMock.mockClear();
    done();
  });
});
