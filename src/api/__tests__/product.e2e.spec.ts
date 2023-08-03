import request from 'supertest';
import { app } from '../app';
import { Sequelize } from 'sequelize-typescript';
import { ProductModel } from '../../modules/product-adm/repository/product.model';

describe('E2E test for product', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    sequelize.addModels([ProductModel]);

    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    const productA = await request(app).post('/products').send({
      id: '1',
      name: 'Product a',
      description: 'Description Product a',
      purchasePrice: 100,
      stock: 10,
    });

    expect(productA.status).toBe(200);
    expect(productA.body.id).toBe('1');
    expect(productA.body.name).toBe('Product a');
    expect(productA.body.description).toBe('Description Product a');
    expect(productA.body.purchasePrice).toBe(100);
    expect(productA.body.stock).toBe(10);

    const productB = await request(app).post('/products').send({
      id: '2',
      name: 'Product b',
      description: 'Description Product b',
      purchasePrice: 200,
      stock: 20,
    });

    expect(productB.status).toBe(200);
    expect(productB.body.id).toBe('2');
    expect(productB.body.name).toBe('Product b');
    expect(productB.body.description).toBe('Description Product b');
    expect(productB.body.purchasePrice).toBe(200);
    expect(productB.body.stock).toBe(20);
  });

  it('should not create a product', async () => {
    const response = await request(app).post('/products').send({
      id: '3',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toStrictEqual([
      'Name is required',
      'Description is required',
      'Purchase price is required',
      'Stock is required',
    ]);
  });
});
