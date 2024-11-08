import { Test, TestingModule } from '@nestjs/testing';
import { TransactionOpenedHandler } from './transaction-opened.handler';
import { TransactionOpenedEvent } from '../../domain/transaction-opened.event';
import { IntegrationEventPublisher, IntegrationEventSubject } from './integration';
import { InjectionUseCase } from '../injection.use-case';

describe('TransactionOpenedHandler', () => {
  let handler: TransactionOpenedHandler;
  let publisher: IntegrationEventPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionOpenedHandler,
        {
          provide: InjectionUseCase.INTEGRATION_EVENT_PUBLISHER,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<TransactionOpenedHandler>(TransactionOpenedHandler);
    publisher = module.get<IntegrationEventPublisher>(InjectionUseCase.INTEGRATION_EVENT_PUBLISHER);
  });

  it('should handle TransactionOpenedEvent and publish the event', async () => {
    const mockEvent: TransactionOpenedEvent = {
      id: 'some-id',
      transactionStatus: 1,
      value: 1000,
    };

    await handler.handle(mockEvent);

    expect(publisher.publish).toHaveBeenCalledWith({
      subject: IntegrationEventSubject.OPENED,
      data: mockEvent,
    });
  });
});
