import { Transport, ClientProviderOptions } from '@nestjs/microservices';
import {
  KAFKA_BROKERS,
  KAFKA_CLIENT_ID,
  KAFKA_GROUP_ID,
  KAFKA_SERVICE,
  KAFKA_TRANSACTION_ID,
} from '../constants';

export const kafkaConfig: ClientProviderOptions = {
  name: KAFKA_SERVICE,
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: KAFKA_CLIENT_ID,
      brokers: [KAFKA_BROKERS],
    },
    consumer: {
      groupId: KAFKA_GROUP_ID,
      maxInFlightRequests: 1,
      sessionTimeout: 30000,
      allowAutoTopicCreation: true,
      readUncommitted: false,
    },
    producer: {
      allowAutoTopicCreation: true,
      idempotent: true,
      transactionalId: KAFKA_TRANSACTION_ID,
      transactionTimeout: 60000,
    },
  },
};
