import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionOpenedHandler } from './application/event/transaction-opened.handler';
import { InjectionUseCase } from './application/injection.use-case';
import { ValidateTransactionHandler } from './application/validate-transaction-use-case/validate-transaction.handler';
import { TransactionFactory } from './domain/transaction.factory';
import { TransactionConsumer } from './infrastructure/consumers/transaction.consumer';
import { IntegrationEventPublisherImplement } from './infrastructure/producers/transaction-event.producer';
import { LoggerService } from './infrastructure/logging/logger.service';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from './infrastructure/config/kafka.config';

const infrastructure: Provider[] = [
  {
    provide: InjectionUseCase.INTEGRATION_EVENT_PUBLISHER,
    useClass: IntegrationEventPublisherImplement,
  },
  LoggerService,
];
const application = [TransactionOpenedHandler, ValidateTransactionHandler];
const domain = [TransactionFactory];
@Module({
  imports: [CqrsModule, ClientsModule.register([kafkaConfig])],
  controllers: [TransactionConsumer],
  providers: [...infrastructure, ...application, ...domain],
  exports: [ClientsModule],
})
export class AntiFraudModule {}
