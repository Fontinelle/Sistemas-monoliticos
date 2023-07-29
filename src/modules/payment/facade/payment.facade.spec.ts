import { Sequelize } from 'sequelize-typescript';
import TransactionModel from '../repository/transaction.model';
import TransactionRepository from '../repository/transaction.repository';
import ProcessPaymentUsecase from '../usecase/process-payment/process-payment.usecase';
import PaymentFacade from './payment.facade';
import PaymentFacadeFactory from '../factory/payment.factory';

describe('PaymentFacade test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a transaction', async () => {
    const facade = PaymentFacadeFactory.create();

    const input = {
      orderId: '1',
      amount: 100,
    };

    const result = await facade.processPayment(input);

    expect(result.transactionId).toBeDefined();
    expect(result.orderId).toBe(input.orderId);
    expect(result.amount).toBe(input.amount);
    expect(result.status).toBe('approved');
  });
});
