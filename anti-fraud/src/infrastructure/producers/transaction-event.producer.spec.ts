import { of } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationEventPublisherImplement } from './transaction-event.producer';
import { LoggerService } from '../logging/logger.service';
import { IntegrationEvent } from '../../application/event/integration';

describe('IntegrationEventPublisherImplement', () => {
  let service: IntegrationEventPublisherImplement;

  const mockKafkaClient = {
    emit: jest.fn().mockReturnValue(of(true)),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrationEventPublisherImplement,
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: 'KAFKA_SERVICE', useValue: mockKafkaClient },
      ],
    }).compile();

    service = module.get<IntegrationEventPublisherImplement>(IntegrationEventPublisherImplement);
  });

  it('should publish a message successfully', async () => {
    const payload: IntegrationEvent = {
      subject: 'approve',
      data: {
        id: '12222222',
        transactionStatus: 1,
        value: 113,
      },
    };

    await service.publish(payload);
    expect(mockKafkaClient.emit).toHaveBeenCalled();
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      expect.stringContaining('Message sent successfully'),
    );
  });

  it('should handle errors', async () => {
    const payload: IntegrationEvent = {
      subject: 'reject',
      data: {
        id: '12222222',
        transactionStatus: 2,
        value: 1213,
      },
    };
    mockKafkaClient.emit.mockReturnValueOnce(of(Promise.reject(new Error('Failed to send'))));
    await service.publish(payload);
    expect(mockLoggerService.error).toHaveBeenCalled();
  });
});
