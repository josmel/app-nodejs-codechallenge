import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Transaction } from '../../application/get-transaction-use-case/transaction.query';
import { TransactionFactory } from '../../domain/transaction.factory';
import { TransactionRepository } from '../../domain/transaction.repository';
import { TransactionInterface } from '../../domain/transaction.aggregate';
import { TransactionEntity } from '../entity/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionRepositoryImplement implements TransactionRepository {
  constructor(
    private readonly transactionFactory: TransactionFactory,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: MongoRepository<TransactionEntity>,
  ) {}

  async newId(): Promise<string> {
    const emptyEntity = new TransactionEntity();
    const entity = await this.transactionRepository.save(emptyEntity);
    return entity.id;
  }

  async findById(id: string): Promise<TransactionInterface | null> {
    const entity = await this.transactionRepository.findOne({ id });
    return entity ? this.entityToModel(entity) : null;
  }

  async saveInfo(data: TransactionInterface): Promise<any> {
    const entity = this.modelToEntity(data);
    await this.transactionRepository.save(entity);
    return this.convertAccountFromEntity(data);
  }

  private modelToEntity(model: TransactionInterface): TransactionEntity {
    const properties = model.properties();
    return {
      ...properties,
      createdAt: properties.openedAt,
      deletedAt: properties.closedAt,
    };
  }

  private entityToModel(entity: TransactionEntity): TransactionInterface {
    return this.transactionFactory.reconstitute({
      ...entity,
      openedAt: entity.createdAt,
      closedAt: entity.deletedAt,
    });
  }

  private convertAccountFromEntity(
    model?: TransactionInterface,
  ): undefined | Transaction {
    const properties = model.propertiesResponse();
    return properties;
  }
}
