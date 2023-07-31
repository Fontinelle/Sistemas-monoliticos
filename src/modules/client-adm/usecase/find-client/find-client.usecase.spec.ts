import Id from '../../../@shared/domain/value-object/id.value-object';
import Address from '../../../@shared/value-object/address';
import Client from '../../domain/client.entity';
import FindClientUseCase from './find-client.usecase';

const clint = new Client({
  id: new Id('1'),
  name: 'John Doe',
  document: '123456789',
  email: 'john@email.com',
  address: new Address({
    street: 'Street 1',
    number: '123',
    complement: 'Complement 1',
    city: 'City 1',
    state: 'State 1',
    zipCode: '12345678',
  }),
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(clint)),
  };
};

describe('Find Client Usecase unit test', () => {
  it('should find a client', async () => {
    const repository = MockRepository();
    const usecase = new FindClientUseCase(repository);

    const input = {
      id: '1',
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(clint.id.id);
    expect(result.name).toEqual(clint.name);
    expect(result.document).toEqual(clint.document);
    expect(result.email).toEqual(clint.email);
    expect(result.address.street).toEqual(clint.address.street);
    expect(result.address.number).toEqual(clint.address.number);
    expect(result.address.complement).toEqual(clint.address.complement);
    expect(result.address.city).toEqual(clint.address.city);
    expect(result.address.state).toEqual(clint.address.state);
    expect(result.address.zipCode).toEqual(clint.address.zipCode);
  });
});
