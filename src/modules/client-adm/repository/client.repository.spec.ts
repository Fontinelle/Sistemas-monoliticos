import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from './client.model';
import Client from '../domain/client.entity';
import ClientRepository from './client.repository';
import Id from '../../@shared/domain/value-object/id.value-object';

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

    const client = new Client({
      id: new Id('1'),
      name: 'John Doe',
      email: 'john@email.com',
      address: 'Street 1',
    });

    await repository.add(client);

    const result = await ClientModel.findOne({ where: { id: client.id.id } });

    expect(result.id).toEqual(client.id.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address).toEqual(client.address);
  });

  it('should find a client', async () => {
    const client = await ClientModel.create({
      id: '1',
      name: 'John Doe',
      email: 'john@email.com',
      address: 'Street 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new ClientRepository();
    const result = await repository.find(client.id);

    expect(result.id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address).toEqual(client.address);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });
});
