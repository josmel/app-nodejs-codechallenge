import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionOpenedEvent } from '../../domain/transaction-opened.event';
import { InjectionUseCase } from '../injection.use-case';

import { IntegrationEventPublisher, IntegrationEventSubject } from './integration';

@EventsHandler(TransactionOpenedEvent)
export class TransactionOpenedHandler implements IEventHandler<TransactionOpenedEvent> {
  constructor(
    @Inject(InjectionUseCase.INTEGRATION_EVENT_PUBLISHER)
    private readonly publisher: IntegrationEventPublisher,
  ) {}

  async handle(event: TransactionOpenedEvent): Promise<void> {
    await this.publisher.publish({
      subject: IntegrationEventSubject.OPENED,
      data: event,
    });
  }
}
