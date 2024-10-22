import { IEvent } from '@nestjs/cqrs';
import { STATUS_TYPE, TransactionEssentialProperties } from './transaction.aggregate';

export class TransactionOpenedEvent implements IEvent, TransactionEssentialProperties {
  readonly id: string;
  readonly transactionStatus: STATUS_TYPE;
  readonly value: number;
}
