import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../repository/client.model';
import ClientAdmFacadeFactory from '../factory/facade.factory';
import Address from '../../@shared/value-object/address';

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
      document: '00000000000',
      email: 'john@email.com',
      address: {
        street: 'Street 1',
        number: '1',
        complement: 'Complement 1',
        city: 'City 1',
        state: 'State 1',
        zipCode: '00000000',
      },
    };

    const clientFacade = ClientAdmFacadeFactory.create();
    await clientFacade.add(input);

    const clientDb = await ClientModel.findOne({ where: { id: input.id } });

    expect(clientDb.id).toEqual(input.id);
    expect(clientDb.name).toEqual(input.name);
    expect(clientDb.document).toEqual(input.document);
    expect(clientDb.email).toEqual(input.email);
    expect(clientDb.street).toEqual(input.address.street);
    expect(clientDb.number).toEqual(input.address.number);
    expect(clientDb.complement).toEqual(input.address.complement);
    expect(clientDb.city).toEqual(input.address.city);
    expect(clientDb.state).toEqual(input.address.state);
    expect(clientDb.zipCode).toEqual(input.address.zipCode);
    expect(clientDb.createdAt).toBeDefined();
    expect(clientDb.updatedAt).toBeDefined();
  });

  it('should find a client', async () => {
    await ClientModel.create({
      id: '1',
      name: 'John Doe',
      document: '00000000000',
      email: 'john@email.com',
      street: 'Street 1',
      number: '1',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '00000000',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientFacade = ClientAdmFacadeFactory.create();
    const result = await clientFacade.find({ id: '1' });

    expect(result.id).toEqual('1');
    expect(result.name).toEqual('John Doe');
    expect(result.document).toEqual('00000000000');
    expect(result.email).toEqual('john@email.com');
    expect(result.address.street).toEqual('Street 1');
    expect(result.address.number).toEqual('1');
    expect(result.address.complement).toEqual('Complement 1');
    expect(result.address.city).toEqual('City 1');
    expect(result.address.state).toEqual('State 1');
    expect(result.address.zipCode).toEqual('00000000');
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });
});
