import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UpdateStatusTransactionHandler } from './update-status-transaction.handler';
import { TransactionRepository } from '../../domain/transaction.repository';
import { InjectionUseCase } from '../injection.use-case';
import { UpdateStatusTransactionCommand } from './update-status-transaction.command';
import { ErrorMessage } from '../../domain/transaction-not-found.exception';
import { STATUS_TYPE } from '../../domain/transaction.aggregate';

describe('UpdateStatusTransactionHandler', () => {
  let handler: UpdateStatusTransactionHandler;
  let transactionRepository: TransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateStatusTransactionHandler,
        {
          provide: InjectionUseCase.TRANSACTION_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            saveInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateStatusTransactionHandler>(UpdateStatusTransactionHandler);
    transactionRepository = module.get<TransactionRepository>(
      InjectionUseCase.TRANSACTION_REPOSITORY,
    );
  });

  it('should update the transaction status successfully', async () => {
    const mockCommand = new UpdateStatusTransactionCommand(
      'transaction-id',
      STATUS_TYPE.approved,
      122,
    );

    const mockTransaction = {
      updateStatus: jest.fn(),
      commit: jest.fn(),
    };

    (transactionRepository.findById as jest.Mock).mockResolvedValue(mockTransaction);

    await handler.execute(mockCommand);

    expect(transactionRepository.findById).toHaveBeenCalledWith('transaction-id');
    expect(mockTransaction.updateStatus).toHaveBeenCalledWith(STATUS_TYPE.approved);
    expect(transactionRepository.saveInfo).toHaveBeenCalledWith(mockTransaction);
    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it('should throw NotFoundException when the transaction is not found', async () => {
    const mockCommand = new UpdateStatusTransactionCommand(
      'transaction-id',
      STATUS_TYPE.approved,
      12222,
    );

    (transactionRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(handler.execute(mockCommand)).rejects.toThrow(
      new NotFoundException(ErrorMessage.TRANSACTION_IS_NOT_FOUND),
    );

    expect(transactionRepository.findById).toHaveBeenCalledWith('transaction-id');
    expect(transactionRepository.saveInfo).not.toHaveBeenCalled();
  });
});
