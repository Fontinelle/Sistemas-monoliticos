import { ProductModel } from '../repository/product.model';
import { InvoiceModel } from '../repository/invoice.model';
import { Sequelize } from 'sequelize-typescript';
import InvoiceFacadeFactory from '../factory/facade.factory';
import Product from '../domain/product.entity';
import Id from '../../@shared/domain/value-object/id.value-object';

describe('Invoice Facade test', () => {
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

  it('should create a invoice', async () => {
    const input = {
      name: 'Invoice 1',
      document: 'document',
      street: 'Street 1',
      number: '1',
      complement: 'complement',
      city: 'city',
      state: 'state',
      zipCode: 'zipCode',
      items: [
        {
          id: '1',
          name: 'Product 1',
          price: 10,
        },
        {
          id: '2',
          name: 'Product 2',
          price: 20,
        },
      ],
    };

    const invoiceFacade = InvoiceFacadeFactory.create();
    await invoiceFacade.generate(input);

    const invoiceDb = await InvoiceModel.findAll({ include: [ProductModel] });

    expect(invoiceDb.length).toBe(1);
    expect(invoiceDb[0].id).toBeDefined();
    expect(invoiceDb[0].name).toEqual(input.name);
    expect(invoiceDb[0].document).toEqual(input.document);
    expect(invoiceDb[0].street).toEqual(input.street);
    expect(invoiceDb[0].number).toEqual(input.number);
    expect(invoiceDb[0].complement).toEqual(input.complement);
    expect(invoiceDb[0].city).toEqual(input.city);
    expect(invoiceDb[0].state).toEqual(input.state);
    expect(invoiceDb[0].zipCode).toEqual(input.zipCode);
    expect(invoiceDb[0].items[0].id).toEqual(input.items[0].id);
    expect(invoiceDb[0].items[0].name).toEqual(input.items[0].name);
    expect(invoiceDb[0].items[0].price).toEqual(input.items[0].price);
    expect(invoiceDb[0].items[1].id).toEqual(input.items[1].id);
    expect(invoiceDb[0].items[1].name).toEqual(input.items[1].name);
    expect(invoiceDb[0].items[1].price).toEqual(input.items[1].price);
  });

  it('should find a invoice', async () => {
    await InvoiceModel.create(
      {
        id: '1',
        name: 'Invoice 1',
        document: 'document',
        street: 'Street 1',
        number: '1',
        complement: 'complement',
        city: 'city',
        state: 'state',
        zipCode: 'zipCode',
        items: [
          {
            id: '1',
            name: 'Product 1',
            price: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            name: 'Product 2',
            price: 25,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { include: [ProductModel] },
    );

    const invoiceFacade = InvoiceFacadeFactory.create();
    const result = await invoiceFacade.find({ id: '1' });

    expect(result).toBeDefined();
    expect(result.id).toEqual('1');
    expect(result.name).toEqual('Invoice 1');
    expect(result.document).toEqual('document');
    expect(result.address.street).toEqual('Street 1');
    expect(result.address.number).toEqual('1');
    expect(result.address.complement).toEqual('complement');
    expect(result.address.city).toEqual('city');
    expect(result.address.state).toEqual('state');
    expect(result.address.zipCode).toEqual('zipCode');
    expect(result.items[0].id).toEqual('1');
    expect(result.items[0].name).toEqual('Product 1');
    expect(result.items[0].price).toEqual(10);
    expect(result.items[1].id).toEqual('2');
    expect(result.items[1].name).toEqual('Product 2');
    expect(result.items[1].price).toEqual(25);
    expect(result.total).toEqual(35);
    expect(result.createdAt).toBeDefined();
  });
});
