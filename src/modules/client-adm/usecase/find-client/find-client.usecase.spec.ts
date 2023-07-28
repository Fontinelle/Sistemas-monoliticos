import Id from '../../../@shared/domain/value-object/id.value-object';
import Client from '../../domain/client.entity';
import FindClientUseCase from './find-client.usecase';

const clint = new Client({
  id: new Id('1'),
  name: 'John Doe',
  email: 'john@email.com',
  address: 'Street 1',
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
    expect(result.email).toEqual(clint.email);
    expect(result.address).toEqual(clint.address);
  });
});
