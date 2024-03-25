import { Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { WalletRepository } from '@app/database/wallet.repository';
import { TransactionRepository } from '@app/database/transaction.repository';
import { PrismaService } from '@app/database';
import { INestMicroservice } from '@nestjs/common';

import { PWModule } from '../src/pw.module';
import { PWController } from '../src/pw.controller';
import { PWService } from '../src/pw.service';

describe('PWMicroService', () => {
  let app: INestMicroservice;
  let prismaService: PrismaService;
  let pwService: PWService;
  let walletRepo: WalletRepository;
  let transactionRepo: TransactionRepository;
  let prismaTransactionSpy;

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

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    pwService = moduleFixture.get<PWService>(PWService);
    walletRepo = moduleFixture.get<WalletRepository>(WalletRepository);
    transactionRepo = moduleFixture.get<TransactionRepository>(
      TransactionRepository,
    );
    prismaTransactionSpy = jest
      .spyOn(prismaService, 'startTransaction')
      .mockImplementation((callback) => callback(prismaService));
  });

  afterAll(async () => {
    await app.close();
  });

  it('pw service should be defined', () => {
    expect(pwService).toBeDefined();
  });

  it('should complete money transfer', async () => {
    const transaction = {
      id: 1,
      fromWalletId: 1,
      toWalletId: 2,
      status: 'NEW',
      amount: 5,
      date: new Date(),
      fromBalance: 0,
      toBalance: 0,
    };
    const walletFrom = {
      id: transaction.fromWalletId,
      name: `test${transaction.fromWalletId}`,
      userId: transaction.fromWalletId,
      balance: 10,
    };
    const walletTo = {
      id: transaction.toWalletId,
      name: `test${transaction.toWalletId}`,
      userId: transaction.toWalletId,
      balance: 10,
    };

    jest.spyOn(transactionRepo, 'findNew').mockResolvedValueOnce([transaction]);

    jest
      .spyOn(walletRepo, 'getById')
      .mockResolvedValueOnce(walletFrom)
      .mockResolvedValueOnce(walletTo);

    jest
      .spyOn(walletRepo, 'update')
      .mockResolvedValueOnce(walletFrom)
      .mockResolvedValueOnce(walletTo);

    const saveMock = jest
      .spyOn(transactionRepo, 'update')
      .mockResolvedValue(transaction);
    await pwService.process();
    expect(prismaTransactionSpy.mock.calls.length).toBe(1);
    expect(saveMock.mock.calls.length).toBe(2);
    expect(saveMock.mock.calls[1][1].status).toBe('COMPLETE');
    saveMock.mockClear();
  });

  it('should not complete money transfer', async () => {
    const transaction = {
      id: 1,
      fromWalletId: 1,
      toWalletId: 2,
      status: 'NEW',
      amount: 5,
      date: new Date(),
      fromBalance: 0,
      toBalance: 0,
    };
    const walletFrom = {
      id: transaction.fromWalletId,
      name: `test${transaction.fromWalletId}`,
      userId: transaction.fromWalletId,
      balance: 0,
    };
    const walletTo = {
      id: transaction.toWalletId,
      name: `test${transaction.toWalletId}`,
      userId: transaction.toWalletId,
      balance: 0,
    };

    jest.spyOn(transactionRepo, 'findNew').mockResolvedValueOnce([transaction]);

    jest
      .spyOn(walletRepo, 'getById')
      .mockResolvedValueOnce(walletFrom)
      .mockResolvedValueOnce(walletTo);

    jest
      .spyOn(walletRepo, 'update')
      .mockResolvedValueOnce(walletFrom)
      .mockResolvedValueOnce(walletTo);

    const saveMock = jest
      .spyOn(transactionRepo, 'update')
      .mockResolvedValue(transaction);
    await pwService.process();
    expect(saveMock.mock.calls.length).toBe(2);
    expect(saveMock.mock.calls[1][1].status).toBe('FAILED');
    saveMock.mockClear();
  });

  describe('Controller', () => {
    let pwController: PWController;

    beforeEach(async () => {
      pwController = app.get<PWController>(PWController);
    });

    it('should return recent transactions', async () => {
      const transaction = {
        id: 1,
        fromWalletId: 1,
        fromWallet: {
          user: {
            id: 1,
            username: 'user1',
          },
        },
        toWalletId: 2,
        toWallet: {
          user: {
            id: 2,
            username: 'user2',
          },
        },
        status: 'NEW',
        amount: 5,
        date: new Date(),
        fromBalance: 0,
        toBalance: 0,
      };
      jest
        .spyOn(transactionRepo, 'findAllTransactions')
        .mockResolvedValueOnce([transaction]);

      const transactions = await pwController.getRecentTransactions(1);
      expect(transactions).toHaveLength(1);
      expect(transactions[0].fromWallet.user.id).toEqual(expect.any(Number));
      expect(transactions[0].toWallet.user.id).toEqual(expect.any(Number));
    });
  });
});
