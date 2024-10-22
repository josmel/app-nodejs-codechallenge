import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTransactionHandler } from './application/create-transaction-use-case/create-transaction.handler';
import { InjectionUseCase } from './application/injection.use-case';
import { TransactionRepositoryImplement } from './infrastructure/repository/transaction.repository';
import { TransactionOpenedHandler } from './application/event/transaction-opened.handler';
import { TransactionQueryImplement } from './infrastructure/query/transaction.query';
import { FindTransactionByIdHandler } from './application/get-transaction-use-case/find-transaction-by-id.handler';
import { CreateTransactionController } from './api/controller/create.transaction.controller';
import { GetTransactionController } from './api/controller/get.transaction.controller';
import { TransactionConsumer } from './infrastructure/consumers/transaction.consumer';
import { UpdateStatusTransactionHandler } from './application/update-status-transaction-use-case/update-status-transaction.handler';
import { IntegrationEventPublisherImplement } from './infrastructure/producers/integration-event.publisher';
import { TransactionFactory } from './domain/transaction.factory';
import { LoggerService } from './infrastructure/logging/logger.service';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from './infrastructure/config/kafka.config';
import { mongodbConfig } from './infrastructure/config/mongodb.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './infrastructure/entity/transaction.entity';

const infrastructure: Provider[] = [
  {
    provide: InjectionUseCase.TRANSACTION_REPOSITORY,
    useClass: TransactionRepositoryImplement,
  },
  {
    provide: InjectionUseCase.INTEGRATION_EVENT_PUBLISHER,
    useClass: IntegrationEventPublisherImplement,
  },
  {
    provide: InjectionUseCase.TRANSACTION_QUERY,
    useClass: TransactionQueryImplement,
  },
  LoggerService,
];

const application = [
  TransactionOpenedHandler,
  CreateTransactionHandler,
  FindTransactionByIdHandler,
  UpdateStatusTransactionHandler,
];
const domain = [TransactionFactory];
@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    CqrsModule,
    ClientsModule.register([kafkaConfig]),
    TypeOrmModule.forRoot(mongodbConfig),
  ],
  controllers: [
    CreateTransactionController,
    GetTransactionController,
    TransactionConsumer,
  ],
  providers: [...infrastructure, ...application, ...domain],
  exports: [ClientsModule],
})
export class TransactionModule {}
