import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  IntegrationEvent,
  IntegrationEventPublisher,
} from '../../application/event/integration';
import { KAFKA_SERVICE, TOPIC_KAFKA_SEND_TRANSACTION } from '../constants';
import { LoggerService } from '../logging/logger.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IntegrationEventPublisherImplement implements IntegrationEventPublisher {
  constructor(
    private readonly logger: LoggerService,
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  async publish(message: IntegrationEvent): Promise<void> {
    this.logger.log(`Transaction --Send transaction Created event--> Anti-Fraud,
      ${JSON.stringify(message)}`);

    try {
      const result = await firstValueFrom(
        this.kafkaClient.emit(TOPIC_KAFKA_SEND_TRANSACTION, message),
      );

      this.logger.log(`Message sent successfully to Kafka ${JSON.stringify(result)}`);
    } catch (error) {
      this.logger.error('Failed to send message to Kafka', error.stack);
    }
  }
}
