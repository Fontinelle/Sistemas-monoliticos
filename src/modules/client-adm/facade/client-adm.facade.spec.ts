import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../repository/client.model';
import ClientAdmFacadeFactory from '../factory/facade.factory';

describe('ClientAdmFacade test', () => {
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

  it('should create a client', async () => {
    const input = {
      id: '1',
      name: 'John Doe',
      email: 'john@email.com',
      address: 'Street 1',
    };

    const clientFacade = ClientAdmFacadeFactory.create();
    await clientFacade.add(input);

    const clientDb = await ClientModel.findOne({ where: { id: input.id } });

    expect(clientDb.id).toEqual(input.id);
    expect(clientDb.name).toEqual(input.name);
    expect(clientDb.email).toEqual(input.email);
    expect(clientDb.address).toEqual(input.address);
  });

  it('should find a client', async () => {
    await ClientModel.create({
      id: '1',
      name: 'John Doe',
      email: 'john@email.com',
      address: 'Street 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientFacade = ClientAdmFacadeFactory.create();
    const result = await clientFacade.find({ id: '1' });

    expect(result.id).toEqual('1');
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john@email.com');
    expect(result.address).toEqual('Street 1');
  });
});
