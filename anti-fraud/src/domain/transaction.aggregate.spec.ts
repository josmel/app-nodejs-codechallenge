import { STATUS_TYPE, TransactionImplement } from './transaction.aggregate';
import { TransactionOpenedEvent } from './transaction-opened.event';

describe('TransactionImplement', () => {
  let transaction: TransactionImplement;

  beforeEach(() => {
    const properties = {
      id: 'transaction-id-1',
      transactionStatus: STATUS_TYPE.pending,
      value: 500,
    };

    transaction = new TransactionImplement(properties);
  });

  it('should return the transaction properties', () => {
    const properties = transaction.properties();
    expect(properties.id).toBe('transaction-id-1');
    expect(properties.transactionStatus).toBe(STATUS_TYPE.pending);
    expect(properties.value).toBe(500);
  });

  it('should approve transaction if value is less than or equal to 1000', () => {
    const validatedTransaction = transaction.validateValue();

    expect(validatedTransaction.transactionStatus).toBe(STATUS_TYPE.approved);
    expect(transaction.properties().transactionStatus).toBe(STATUS_TYPE.approved);
  });

  it('should reject transaction if value is greater than 1000', () => {
    const highValueTransaction = new TransactionImplement({
      id: 'transaction-id-2',
      transactionStatus: STATUS_TYPE.pending,
      value: 2000,
    });

    const validatedTransaction = highValueTransaction.validateValue();

    expect(validatedTransaction.transactionStatus).toBe(STATUS_TYPE.rejected);
    expect(highValueTransaction.properties().transactionStatus).toBe(STATUS_TYPE.rejected);
  });

  it('should apply TransactionOpenedEvent when transaction is validated', () => {
    const applySpy = jest.spyOn(transaction, 'apply');

    transaction.validateValue();

    expect(applySpy).toHaveBeenCalledWith(expect.any(TransactionOpenedEvent));
  });
});
