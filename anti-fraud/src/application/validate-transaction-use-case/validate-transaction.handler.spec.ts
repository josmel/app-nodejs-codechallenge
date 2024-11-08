import { Test, TestingModule } from '@nestjs/testing';
import { ValidateTransactionCommand } from './validate-transaction.command';
import { ValidateTransactionHandler } from './validate-transaction.handler';
import { TransactionFactory } from '../../domain/transaction.factory';
import { TransactionInterface } from 'src/domain/transaction.aggregate';

const mockTransactionFactory = () => ({
  create: jest.fn(),
});

describe('ValidateTransactionHandler', () => {
  let handler: ValidateTransactionHandler;
  let factory: TransactionFactory;
  let transaction: jest.Mocked<TransactionInterface>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateTransactionHandler,
        { provide: TransactionFactory, useFactory: mockTransactionFactory },
      ],
    }).compile();

    handler = module.get<ValidateTransactionHandler>(ValidateTransactionHandler);
    factory = module.get<TransactionFactory>(TransactionFactory);

    transaction = {
      validateValue: jest.fn(),
      commit: jest.fn(),
      properties: jest.fn(),
      propertiesResponse: jest.fn(),
      openAccount: jest.fn(),
      updateStatus: jest.fn(),
    } as jest.Mocked<TransactionInterface>;
  });

  it('should handle ValidateTransactionCommand successfully', async () => {
    const command = new ValidateTransactionCommand('id1', 1, 100);

    (factory.create as jest.Mock).mockReturnValue(transaction);

    await handler.execute(command);

    expect(factory.create).toHaveBeenCalledWith('id1', 1, 100);
    expect(transaction.validateValue).toHaveBeenCalled();
    expect(transaction.commit).toHaveBeenCalled();
  });

  it('should throw an error if the transaction validation fails', async () => {
    const command = new ValidateTransactionCommand('id1', 1, 100);

    (factory.create as jest.Mock).mockReturnValue(transaction);

    transaction.validateValue.mockImplementation(() => {
      throw new Error('Validation failed');
    });

    await expect(handler.execute(command)).rejects.toThrow('Validation failed');
  });
});
