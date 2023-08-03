import { ProductInvoiceModel } from '../repository/product.model';
import { InvoiceModel } from '../repository/invoice.model';
import { Sequelize } from 'sequelize-typescript';
import InvoiceFacadeFactory from '../factory/facade.factory';

describe('Invoice Facade test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductInvoiceModel]);
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
    const invoice = await invoiceFacade.generate(input);

    expect(invoice.id).toBeDefined();
    expect(invoice.name).toEqual(input.name);
    expect(invoice.document).toEqual(input.document);
    expect(invoice.street).toEqual(input.street);
    expect(invoice.number).toEqual(input.number);
    expect(invoice.complement).toEqual(input.complement);
    expect(invoice.city).toEqual(input.city);
    expect(invoice.state).toEqual(input.state);
    expect(invoice.zipCode).toEqual(input.zipCode);
    expect(invoice.items[0].id).toBeDefined();
    expect(invoice.items[0].name).toEqual(input.items[0].name);
    expect(invoice.items[0].price).toEqual(input.items[0].price);
    expect(invoice.items[1].id).toBeDefined();
    expect(invoice.items[1].name).toEqual(input.items[1].name);
    expect(invoice.items[1].price).toEqual(input.items[1].price);
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
      { include: [ProductInvoiceModel] },
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
    expect(result.items[0].id).toBeDefined();
    expect(result.items[0].name).toEqual('Product 1');
    expect(result.items[0].price).toEqual(10);
    expect(result.items[1].id).toBeDefined();
    expect(result.items[1].name).toEqual('Product 2');
    expect(result.items[1].price).toEqual(25);
    expect(result.total).toEqual(35);
    expect(result.createdAt).toBeDefined();
  });
});
