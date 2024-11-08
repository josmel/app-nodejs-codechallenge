import {
  STATUS_TYPE,
  TransactionImplement,
  TransactionProperties,
} from './transaction.aggregate';

describe('TransactionImplement', () => {
  let transaction: TransactionImplement;

  beforeEach(() => {
    const transactionProperties: TransactionProperties = {
      id: 'some-id',
      transactionStatus: STATUS_TYPE.pending,
      accountExternalIdDebit: 'account-debit',
      accountExternalIdCredit: 'account-credit',
      tranferTypeId: 1,
      value: 500,
      openedAt: new Date(),
      updatedAt: new Date(),
      closedAt: null,
    };

    transaction = new TransactionImplement(transactionProperties);
  });

  it('should return the correct properties', () => {
    const properties = transaction.properties();
    expect(properties).toEqual({
      id: 'some-id',
      transactionStatus: STATUS_TYPE.pending,
      accountExternalIdDebit: 'account-debit',
      accountExternalIdCredit: 'account-credit',
      tranferTypeId: 1,
      value: 500,
      openedAt: expect.any(Date),
      updatedAt: expect.any(Date),
      closedAt: null,
    });
  });

  it('should trigger the TransactionOpenedEvent when account is opened', () => {
    const applySpy = jest.spyOn(transaction, 'apply');

    transaction.openAccount();

    expect(applySpy).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should update the transaction status', () => {
    transaction.updateStatus(STATUS_TYPE.approved);
    const properties = transaction.properties();

    expect(properties.transactionStatus).toBe(STATUS_TYPE.approved);
  });
});
