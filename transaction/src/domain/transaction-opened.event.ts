import { IEvent } from '@nestjs/cqrs';
import { STATUS_TYPE, TransactionProperties } from './transaction.aggregate';

export class TransactionOpenedEvent implements IEvent, TransactionProperties {
  readonly id: string;
  readonly transactionStatus: STATUS_TYPE;
  readonly accountExternalIdDebit: string;
  readonly accountExternalIdCredit: string;
  readonly tranferTypeId: number;
  readonly value: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt: Date | null;
}
