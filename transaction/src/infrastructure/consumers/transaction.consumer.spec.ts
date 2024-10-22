import { Test, TestingModule } from '@nestjs/testing';
import { TransactionConsumer } from './transaction.consumer';
import { CommandBus } from '@nestjs/cqrs';
import { LoggerService } from '../logging/logger.service';
import { AntiFraudDto } from '../../api/dto/update-status-transaction.param.dto';
import { UpdateStatusTransactionCommand } from '../../application/update-status-transaction-use-case/update-status-transaction.command';

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

  it('should log error if transaction processing fails', async () => {
    const mockPayload: AntiFraudDto = {
      topic: 'transaction-topic',
      partition: 0,
      value: {
        subject: 'Transaction validation',
        data: {
          id: 'some-id',
          value: 500,
          transactionStatus: 1,
        },
      },
    };

    const commandBusError = new Error('Command execution failed');
    (commandBus.execute as jest.Mock).mockRejectedValueOnce(commandBusError);

    await consumer.consume(mockPayload);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.any(UpdateStatusTransactionCommand),
    );
    expect(logger.error).toHaveBeenCalledWith(
      'Error processing transaction',
      commandBusError.stack,
    );
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

    expect(logger.error).toHaveBeenCalledWith(
      'Error processing transaction',
      expect.any(String),
    );
    expect(commandBus.execute).not.toHaveBeenCalled();
  });
});
