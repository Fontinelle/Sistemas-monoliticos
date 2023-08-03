import request from 'supertest';
import { app } from '../app';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import { Sequelize } from 'sequelize-typescript';

describe('E2E test for client', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    sequelize.addModels([ClientModel]);

    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a client', async () => {
    const response = await request(app)
      .post('/clients')
      .send({
        id: '1',
        name: 'Client',
        document: '123456789',
        email: 'client@email.com',
        address: {
          street: 'Street',
          number: '123',
          complement: 'Complement',
          city: 'City',
          state: 'State',
          zipCode: '12345678',
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe('1');
    expect(response.body.name).toBe('Client');
    expect(response.body.document).toBe('123456789');
    expect(response.body.email).toBe('client@email.com');
    expect(response.body.address.street).toBe('Street');
    expect(response.body.address.number).toBe('123');
    expect(response.body.address.complement).toBe('Complement');
    expect(response.body.address.city).toBe('City');
    expect(response.body.address.state).toBe('State');
    expect(response.body.address.zipCode).toBe('12345678');
  });

  it('should not create a client', async () => {
    const response = await request(app).post('/clients').send({
      id: '2',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toStrictEqual([
      'Name is required',
      'Document is required',
      'Email is required',
      'Street is required',
      'Number is required',
      'Complement is required',
      'City is required',
      'State is required',
      'Zip code is required',
    ]);
  });
});
