import { Sequelize } from 'sequelize-typescript';
import { ProductModel } from './product.model';
import { InvoiceModel } from './invoice.model';
import Product from '../domain/product.entity';
import Id from '../../@shared/domain/value-object/id.value-object';
import Address from '../../@shared/value-object/address';
import Invoice from '../domain/invoice.entity';
import InvoiceRepository from './invoice.repository';

describe('Invoice Repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should generate a invoice', async () => {
    const repository = new InvoiceRepository();

    const address = new Address({
      street: 'Street 1',
      number: '1',
      complement: 'complement',
      city: 'city',
      state: 'state',
      zipCode: 'zipCode',
    });

    const product1 = new Product({
      id: new Id('1'),
      name: 'Product 1',
      price: 10,
    });

    const product2 = new Product({
      id: new Id('2'),
      name: 'Product 2',
      price: 20,
    });

    const invoice = new Invoice({
      id: new Id('1'),
      name: 'Invoice 1',
      document: 'document',
      address: address,
      items: [product1, product2],
    });

    await repository.generate(invoice);

    const result = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: [ProductModel],
    });

    expect(result.id).toEqual(invoice.id.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.street).toEqual(invoice.address.street);
    expect(result.number).toEqual(invoice.address.number);
    expect(result.complement).toEqual(invoice.address.complement);
    expect(result.city).toEqual(invoice.address.city);
    expect(result.state).toEqual(invoice.address.state);
    expect(result.zipCode).toEqual(invoice.address.zipCode);
    expect(result.items[0].id).toEqual(invoice.items[0].id.id);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].id).toEqual(invoice.items[1].id.id);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
  });
});
