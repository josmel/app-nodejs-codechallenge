import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { tranferTypeIdObject } from '../../domain/transfer-type-id.vo';
import { TransactionFactory } from '../../domain/transaction.factory';
import { TransactionRepository } from '../../domain/transaction.repository';
import { STATUS_TYPE } from '../../domain/transaction.aggregate';
import { InjectionUseCase } from '../injection.use-case';
import { CreateTransactionCommand } from './create-transaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    @Inject(InjectionUseCase.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionFactory: TransactionFactory,
  ) {}

  public async execute(command: CreateTransactionCommand) {
    console.log(
      'Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]',
    );

    const tranferTypeId = new tranferTypeIdObject(command.tranferTypeId);
    tranferTypeId.validate();
    const account = this.transactionFactory.create(
      await this.transactionRepository.newId(),
      STATUS_TYPE.pending,
      command.accountExternalIdDebit,
      command.accountExternalIdCredit,
      command.tranferTypeId,
      command.value,
    );
    account.openAccount();
    const response = await this.transactionRepository.saveInfo(account);
    account.commit();
    return response;
  }
}
