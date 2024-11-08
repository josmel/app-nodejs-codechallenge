import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AntiFraudDto } from '../../api/dto/update-status-transaction.param.dto';
import { UpdateStatusTransactionCommand } from '../../application/update-status-transaction-use-case/update-status-transaction.command';
import { TOPIC_KAFKA_RECIVE_STATUS_TRANSACTION } from '../constants';
import { LoggerService } from '../logging/logger.service';

@Controller()
export class TransactionConsumer {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: LoggerService,
  ) {}

  @EventPattern(TOPIC_KAFKA_RECIVE_STATUS_TRANSACTION)
  public async consume(@Payload() payload: AntiFraudDto): Promise<void> {
    this.logger.log(
      `TRANSACTION: TransactionConsumer/client -- message',
      ${JSON.stringify(payload)}`,
    );
    try {
      const command: UpdateStatusTransactionCommand = new UpdateStatusTransactionCommand(
        payload.value.data.id,
        payload.value.data.transactionStatus,
        payload.value.data.value,
      );
      await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error('Error processing transaction', error.stack);
    }
  }
}
