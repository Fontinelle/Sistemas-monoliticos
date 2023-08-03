import { Sequelize } from 'sequelize-typescript';
import { OrderModel } from './order.model';
import Product from '../domain/product.entity';
import Id from '../../@shared/domain/value-object/id.value-object';
import Address from '../../@shared/value-object/address';
import Client from '../domain/client.entity';
import Order from '../domain/order.entity';
import { ClientModel } from '../../client-adm/repository/client.model';
import OrderRepository from './order.repository';
import { ProductStoreCatalogModel } from '../../store-catalog/repository/product.model';

describe('Checkout Repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    await sequelize.addModels([
      ProductStoreCatalogModel,
      ClientModel,
      OrderModel,
    ]);
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should add order', async () => {
    const repository = new OrderRepository();

    const address = new Address({
      street: 'Street 1',
      number: '1',
      complement: 'complement',
      city: 'city',
      state: 'state',
      zipCode: 'zipCode',
    });

    const client = new Client({
      id: new Id('1'),
      name: 'Client 1',
      email: 'email',
      document: 'document',
      address: address,
    });

    const product1 = new Product({
      id: new Id('1'),
      name: 'Product 1',
      description: 'description',
      salesPrice: 10,
    });

    const product2 = new Product({
      id: new Id('2'),
      name: 'Product 2',
      description: 'description',
      salesPrice: 20,
    });

    const order = new Order({
      id: new Id('1'),
      client: client,
      products: [product1, product2],
    });

    await repository.addOrder(order);

    const result = await OrderModel.findOne({
      where: { id: order.id.id },
      include: [ProductStoreCatalogModel, ClientModel],
    });

    expect(result.id).toEqual(order.id.id);
    expect(result.client.name).toEqual(order.client.name);
    expect(result.client.email).toEqual(order.client.email);
    expect(result.client.document).toEqual(order.client.document);
    expect(result.client.street).toEqual(order.client.address.street);
    expect(result.client.number).toEqual(order.client.address.number);
    expect(result.client.complement).toEqual(order.client.address.complement);
    expect(result.client.city).toEqual(order.client.address.city);
    expect(result.client.state).toEqual(order.client.address.state);
    expect(result.client.zipCode).toEqual(order.client.address.zipCode);
    expect(result.products[0].name).toEqual(order.products[0].name);
    expect(result.products[0].description).toEqual(
      order.products[0].description,
    );
    expect(result.products[0].salesPrice).toEqual(order.products[0].salesPrice);
    expect(result.products[1].name).toEqual(order.products[1].name);
    expect(result.products[1].description).toEqual(
      order.products[1].description,
    );
    expect(result.products[1].salesPrice).toEqual(order.products[1].salesPrice);
  });

  it('should find order', async () => {
    const repository = new OrderRepository();

    const address = new Address({
      street: 'Street 1',
      number: '1',
      complement: 'complement',
      city: 'city',
      state: 'state',
      zipCode: 'zipCode',
    });

    const client = new Client({
      id: new Id('1'),
      name: 'Client 1',
      email: 'email',
      document: 'document',
      address: address,
    });

    const product1 = new Product({
      id: new Id('1'),
      name: 'Product 1',
      description: 'description',
      salesPrice: 10,
    });

    const product2 = new Product({
      id: new Id('2'),
      name: 'Product 2',
      description: 'description',
      salesPrice: 20,
    });

    const order = new Order({
      id: new Id('1'),
      client: client,
      products: [product1, product2],
    });

    await repository.addOrder(order);

    const result = await repository.findOrder(order.id.id);

    expect(result.id.id).toEqual(order.id.id);
    expect(result.client.name).toEqual(order.client.name);
    expect(result.client.email).toEqual(order.client.email);
    expect(result.client.document).toEqual(order.client.document);
    expect(result.client.address.street).toEqual(order.client.address.street);
    expect(result.client.address.number).toEqual(order.client.address.number);
    expect(result.client.address.complement).toEqual(
      order.client.address.complement,
    );
    expect(result.client.address.city).toEqual(order.client.address.city);
    expect(result.client.address.state).toEqual(order.client.address.state);
    expect(result.client.address.zipCode).toEqual(order.client.address.zipCode);
    expect(result.products[0].name).toEqual(order.products[0].name);
    expect(result.products[0].description).toEqual(
      order.products[0].description,
    );
    expect(result.products[0].salesPrice).toEqual(order.products[0].salesPrice);
    expect(result.products[1].name).toEqual(order.products[1].name);
    expect(result.products[1].description).toEqual(
      order.products[1].description,
    );
    expect(result.products[1].salesPrice).toEqual(order.products[1].salesPrice);
  });
});
