import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorMessage } from '../../domain/transaction-not-found.exception';
import { TransactionRepository } from '../../domain/transaction.repository';
import { InjectionUseCase } from '../injection.use-case';
import { UpdateStatusTransactionCommand } from './update-status-transaction.command';

@CommandHandler(UpdateStatusTransactionCommand)
export class UpdateStatusTransactionHandler
  implements ICommandHandler<UpdateStatusTransactionCommand>
{
  constructor(
    @Inject(InjectionUseCase.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}
  public async execute(command: UpdateStatusTransactionCommand): Promise<void> {
    console.log(
      'Transaction -- Update transaction Status event--> transactionDatabase[(Database)]',
    );

    const transaction = await this.transactionRepository.findById(command.id);

    if (!transaction) throw new NotFoundException(ErrorMessage.TRANSACTION_IS_NOT_FOUND);

    transaction.updateStatus(command.transactionStatus);

    await this.transactionRepository.saveInfo(transaction);

    transaction.commit();
  }
}
