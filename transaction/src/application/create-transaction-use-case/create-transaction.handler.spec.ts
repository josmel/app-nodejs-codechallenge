import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionHandler } from './create-transaction.handler';
import { TransactionFactory } from '../../domain/transaction.factory';
import { TransactionRepository } from '../../domain/transaction.repository';
import { CreateTransactionCommand } from './create-transaction.command';
import { STATUS_TYPE } from '../../domain/transaction.aggregate';
import { InjectionUseCase } from '../injection.use-case';
import { tranferTypeIdObject } from '../../domain/transfer-type-id.vo';

describe('CreateTransactionHandler', () => {
  let handler: CreateTransactionHandler;
  let transactionRepository: TransactionRepository;
  let transactionFactory: TransactionFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionHandler,
        {
          provide: InjectionUseCase.TRANSACTION_REPOSITORY,
          useValue: {
            newId: jest.fn().mockResolvedValue('new-transaction-id'),
            saveInfo: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: TransactionFactory,
          useValue: {
            create: jest.fn().mockReturnValue({
              openAccount: jest.fn(),
              commit: jest.fn(),
              properties: jest.fn().mockReturnValue({
                id: 'new-transaction-id',
                accountExternalIdDebit: 'account-debit',
                accountExternalIdCredit: 'account-credit',
                tranferTypeId: 1,
                value: 1000,
                transactionStatus: STATUS_TYPE.pending,
              }),
            }),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateTransactionHandler>(CreateTransactionHandler);
    transactionRepository = module.get<TransactionRepository>(
      InjectionUseCase.TRANSACTION_REPOSITORY,
    );
    transactionFactory = module.get<TransactionFactory>(TransactionFactory);
  });

  it('should create and save a transaction with pending status', async () => {
    const command = new CreateTransactionCommand(
      'account-debit',
      'account-credit',
      1,
      1000,
    );

    const result = await handler.execute(command);

    expect(transactionRepository.newId).toHaveBeenCalled();
    expect(transactionFactory.create).toHaveBeenCalledWith(
      'new-transaction-id',
      STATUS_TYPE.pending,
      'account-debit',
      'account-credit',
      1,
      1000,
    );
    expect(transactionRepository.saveInfo).toHaveBeenCalled();
    expect(result).toEqual({});
  });

  it('should validate the transfer type id', async () => {
    const command = new CreateTransactionCommand(
      'account-debit',
      'account-credit',
      1,
      1000,
    );

    const validateSpy = jest.spyOn(tranferTypeIdObject.prototype, 'validate');

    await handler.execute(command);

    expect(validateSpy).toHaveBeenCalled();
  });

  it('should open account and commit', async () => {
    const command = new CreateTransactionCommand(
      'account-debit',
      'account-credit',
      1,
      1000,
    );

    const mockAccount = transactionFactory.create(
      'new-transaction-id',
      STATUS_TYPE.pending,
      'account-debit',
      'account-credit',
      1,
      1000,
    );

    await handler.execute(command);

    expect(mockAccount.openAccount).toHaveBeenCalled();
    expect(mockAccount.commit).toHaveBeenCalled();
  });
});
