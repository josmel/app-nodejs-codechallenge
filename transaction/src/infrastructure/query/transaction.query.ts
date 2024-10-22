import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../entity/transaction.entity';
import {
  Transaction,
  TransactionQuery,
} from '../../application/get-transaction-use-case/transaction.query';
import { TransactionImplement } from '../../domain/transaction.aggregate';

@Injectable()
export class TransactionQueryImplement implements TransactionQuery {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: MongoRepository<TransactionEntity>,
  ) {}

  async findById(id: string): Promise<undefined | Transaction> {
    return this.convertAccountFromEntity(
      await this.transactionRepository.findOne({ where: { id } }),
    );
  }

  private convertAccountFromEntity(entity?: TransactionEntity): undefined | Transaction {
    if (entity) {
      const model = new TransactionImplement({
        id: entity.id,
        accountExternalIdDebit: entity.accountExternalIdDebit,
        accountExternalIdCredit: entity.accountExternalIdCredit,
        tranferTypeId: entity.tranferTypeId,
        value: entity.value,
        transactionStatus: entity.transactionStatus,
        openedAt: entity.createdAt,
      });
      const properties = model.propertiesResponse();
      return properties;
    }
    return undefined;
  }
}
