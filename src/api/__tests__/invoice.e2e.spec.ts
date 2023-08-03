import request from 'supertest';
import { app } from '../app';
import { Sequelize } from 'sequelize-typescript';
import { migrator } from '../../database/config-migrations/migrator';
import { InvoiceModel } from '../../modules/invoice/repository/invoice.model';
import InvoiceRepository from '../../modules/invoice/repository/invoice.repository';
import GenerateInvoiceUsecase from '../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase';
import { ProductInvoiceModel } from '../../modules/invoice/repository/product.model';

describe('E2E test for invoice', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    await sequelize.addModels([InvoiceModel, ProductInvoiceModel]);

    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a invoice', async () => {
    const useCase = new GenerateInvoiceUsecase(new InvoiceRepository());

    const invoice = await useCase.execute({
      name: 'Client A',
      document: '123456789',
      street: 'Street A',
      number: '123',
      complement: 'Complement A',
      city: 'City A',
      state: 'State A',
      zipCode: '12345678',
      items: [
        {
          id: '1',
          name: 'Product A',
          price: 100,
        },
        {
          id: '2',
          name: 'Product B',
          price: 200,
        },
      ],
    });

    const response = await request(app).get(`/invoice/${invoice.id}`);

    expect(response.status).toBe(200);
  });
});
