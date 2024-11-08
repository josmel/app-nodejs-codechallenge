import { Test, TestingModule } from '@nestjs/testing';
import { FindTransactionByIdHandler } from './find-transaction-by-id.handler';
import { TransactionQuery } from './transaction.query';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { FindTransactionByIdQuery } from './find-transaction-by-id.query';
import { FindTransactionByIdResult } from './find-transaction-by-id.result';
import { ErrorMessage } from '../../domain/transaction-not-found.exception';
import { InjectionUseCase } from '../injection.use-case';

describe('FindTransactionByIdHandler', () => {
  let handler: FindTransactionByIdHandler;
  let transactionQuery: TransactionQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindTransactionByIdHandler,
        {
          provide: InjectionUseCase.TRANSACTION_QUERY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<FindTransactionByIdHandler>(FindTransactionByIdHandler);
    transactionQuery = module.get<TransactionQuery>(InjectionUseCase.TRANSACTION_QUERY);
  });

  it('should return data when transaction is found', async () => {
    const mockQuery = new FindTransactionByIdQuery('some-id');

    const mockData: FindTransactionByIdResult = {
      transactionExternalId: 'some-id',
      transactionStatus: {
        name: 'approved',
      },
      transactionType: {
        name: 'IMPS',
      },
      value: 1000,
      createdAt: new Date(),
    };

    (transactionQuery.findById as jest.Mock).mockResolvedValue(mockData);

    const result = await handler.execute(mockQuery);

    expect(transactionQuery.findById).toHaveBeenCalledWith('some-id');
    expect(result).toEqual(mockData);
  });

  it('should throw NotFoundException when transaction is not found', async () => {
    const mockQuery = new FindTransactionByIdQuery('some-id');

    (transactionQuery.findById as jest.Mock).mockResolvedValue(null);

    await expect(handler.execute(mockQuery)).rejects.toThrow(
      new NotFoundException(ErrorMessage.TRANSACTION_IS_NOT_FOUND),
    );
    expect(transactionQuery.findById).toHaveBeenCalledWith('some-id');
  });

  it('should throw InternalServerErrorException when data keys mismatch', async () => {
    const mockQuery = new FindTransactionByIdQuery('some-id');
    const mockData = {
      transactionExternalId: 'some-id',
      transactionStatus: {
        name: 'approved',
      },
    };

    (transactionQuery.findById as jest.Mock).mockResolvedValue(mockData);

    await expect(handler.execute(mockQuery)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
