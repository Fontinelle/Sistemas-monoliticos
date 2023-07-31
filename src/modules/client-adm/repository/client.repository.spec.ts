import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from './client.model';
import Client from '../domain/client.entity';
import ClientRepository from './client.repository';
import Id from '../../@shared/domain/value-object/id.value-object';
import Address from '../../@shared/value-object/address';

describe('ClientRepository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should add a client', async () => {
    const repository = new ClientRepository();
    const address = new Address({
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '12345678',
    });

    const client = new Client({
      id: new Id('1'),
      name: 'John Doe',
      document: '00000000000',
      email: 'john@email.com',
      address: address,
    });

    await repository.add(client);

    const result = await ClientModel.findOne({ where: { id: client.id.id } });

    expect(result.id).toEqual(client.id.id);
    expect(result.name).toEqual(client.name);
    expect(result.document).toEqual(client.document);
    expect(result.email).toEqual(client.email);
    expect(result.street).toEqual(client.address.street);
    expect(result.number).toEqual(client.address.number);
    expect(result.complement).toEqual(client.address.complement);
    expect(result.city).toEqual(client.address.city);
    expect(result.state).toEqual(client.address.state);
    expect(result.zipCode).toEqual(client.address.zipCode);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  it('should find a client', async () => {
    const client = await ClientModel.create({
      id: '1',
      name: 'John Doe',
      document: '00000000000',
      email: 'john@email.com',
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '12345678',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new ClientRepository();
    const result = await repository.find(client.id);

    expect(result.id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.document).toEqual(client.document);
    expect(result.email).toEqual(client.email);
    expect(result.address.street).toEqual(client.street);
    expect(result.address.number).toEqual(client.number);
    expect(result.address.complement).toEqual(client.complement);
    expect(result.address.city).toEqual(client.city);
    expect(result.address.state).toEqual(client.state);
    expect(result.address.zipCode).toEqual(client.zipCode);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });
});
