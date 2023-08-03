import request from 'supertest';
import { app } from '../app';
import { Sequelize } from 'sequelize-typescript';
import { migrator } from '../../database/config-migrations/migrator';
import { InvoiceModel } from '../../modules/invoice/repository/invoice.model';
import { ProductInvoiceModel } from '../../modules/invoice/repository/product.model';
import { ProductStoreCatalogModel } from '../../modules/store-catalog/repository/product.model';
import { ProductModel } from '../../modules/product-adm/repository/product.model';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import { OrderModel } from '../../modules/checkout/repository/order.model';
import { TransactionModel } from '../../modules/payment/repository/transaction.model';

describe('E2E test for checkout', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    await sequelize.addModels([
      ProductModel,
      ProductInvoiceModel,
      ProductStoreCatalogModel,
      InvoiceModel,
      OrderModel,
      ClientModel,
      TransactionModel,
    ]);

    await migrator(sequelize).up();
  });

  afterEach(async () => {
    await migrator(sequelize).down();
    await sequelize.close();
  });

  it('should create a checkout', async () => {
    const response = await request(app)
      .post('/clients')
      .send({
        id: '1',
        name: 'Client',
        document: '123456789',
        email: 'client@email.com',
        address: {
          street: 'Street',
          number: '123',
          complement: 'Complement',
          city: 'City',
          state: 'State',
          zipCode: '12345678',
        },
      });

    expect(response.status).toBe(200);

    const productA = await request(app).post('/products').send({
      id: '1',
      name: 'Product a',
      description: 'Description Product a',
      purchasePrice: 100,
      stock: 10,
    });

    expect(productA.status).toBe(200);

    const productB = await request(app).post('/products').send({
      id: '2',
      name: 'Product b',
      description: 'Description Product b',
      purchasePrice: 200,
      stock: 20,
    });

    expect(productB.status).toBe(200);

    const checkout = await request(app)
      .post('/checkout')
      .send({
        clientId: '1',
        products: [
          { productId: productA.body.id },
          { productId: productB.body.id },
        ],
      });

    expect(checkout.status).toBe(200);
    expect(checkout.body.id).toBeDefined();
    expect(checkout.body.invoiceId).toBeDefined();
    expect(checkout.body.status).toBe('approved');
    expect(checkout.body.total).toBe(300);
    expect(checkout.body.products[0].productId).toBe('1');
    expect(checkout.body.products[1].productId).toBe('2');
  });

  it('should not create a client', async () => {
    const response = await request(app).post('/checkout').send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toStrictEqual([
      'clientId is a required field',
      'products is a required field',
    ]);
  });
});
