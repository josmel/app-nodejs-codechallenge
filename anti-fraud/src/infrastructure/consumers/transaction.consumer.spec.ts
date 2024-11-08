import { Test, TestingModule } from '@nestjs/testing';
import { TransactionConsumer } from './transaction.consumer';
import { CommandBus } from '@nestjs/cqrs';
import { LoggerService } from '../logging/logger.service';
import { AntiFraudDto } from '../../api/dto/read-transaction.param.dto';
import { ValidateTransactionCommand } from '../../application/validate-transaction-use-case/validate-transaction.command';

const mockPayload: AntiFraudDto = {
  topic: 'transaction-topic',
  partition: 0,
  value: {
    subject: 'Transaction validation',
    data: {
      id: 'some-id',
      accountExternalIdDebit: 'account-debit',
      accountExternalIdCredit: 'account-credit',
      tranferTypeId: 1,
      value: 500,
      transactionStatus: 1,
    },
  },
};
describe('TransactionConsumer', () => {
  let consumer: TransactionConsumer;
  let commandBus: CommandBus;
  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionConsumer,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    consumer = module.get<TransactionConsumer>(TransactionConsumer);
    commandBus = module.get<CommandBus>(CommandBus);
    logger = module.get<LoggerService>(LoggerService);
  });

  it('should consume message and execute command', async () => {
    await consumer.consume(mockPayload);

    expect(logger.log).toHaveBeenCalledWith(
      `Received message from Kafka: ${JSON.stringify(mockPayload)}`,
    );
    expect(commandBus.execute).toHaveBeenCalledWith(expect.any(ValidateTransactionCommand));
    expect(logger.log).toHaveBeenCalledWith('Command executed successfully');
  });

  it('should log error for invalid payload', async () => {
    const invalidPayload: AntiFraudDto = {
      topic: 'transaction-topic',
      partition: 0,
      value: {
        subject: 'Transaction validation',
        data: null as any,
      },
    };

    await consumer.consume(invalidPayload);

    expect(logger.error).toHaveBeenCalledWith('Invalid payload received', 'No data in payload');
    expect(commandBus.execute).not.toHaveBeenCalled();
  });

  it('should handle command execution error', async () => {
    const commandBusError = new Error('Command execution failed');

    (commandBus.execute as jest.Mock).mockRejectedValueOnce(commandBusError);

    await consumer.consume(mockPayload);

    expect(logger.error).toHaveBeenCalledWith(
      'Error processing transaction',
      commandBusError.stack,
    );
    expect(commandBus.execute).toHaveBeenCalledWith(expect.any(ValidateTransactionCommand));
  });
});
