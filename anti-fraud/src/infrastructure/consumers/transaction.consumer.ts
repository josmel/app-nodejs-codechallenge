import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ValidateTransactionCommand } from '../../application/validate-transaction-use-case/validate-transaction.command';
import { AntiFraudDto } from '../../api/dto/read-transaction.param.dto';
import { TOPIC_KAFKA_SEND_TRANSACTION } from '../constants';
import { LoggerService } from '../logging/logger.service';

@Controller()
export class TransactionConsumer {
  constructor(private readonly commandBus: CommandBus, private readonly logger: LoggerService) {}

  @EventPattern(TOPIC_KAFKA_SEND_TRANSACTION)
  public async consume(@Payload() payload: AntiFraudDto): Promise<void> {
    this.logger.log(`Received message from Kafka: ${JSON.stringify(payload)}`);

    if (!payload || !payload.value?.data) {
      this.logger.error('Invalid payload received', 'No data in payload');
      return;
    }
    try {
      const command: ValidateTransactionCommand = new ValidateTransactionCommand(
        payload.value.data.id,
        payload.value.data.transactionStatus,
        payload.value.data.value,
      );
      await this.commandBus.execute(command);

      this.logger.log('Command executed successfully');
    } catch (error) {
      this.logger.error('Error processing transaction', error.stack);
    }
  }
}
