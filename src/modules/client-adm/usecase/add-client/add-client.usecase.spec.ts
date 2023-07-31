import AddClientUseCase from './add-client.usecase';

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe('Add Client Usecase unit test', () => {
  it('should add a client', async () => {
    const repository = MockRepository();
    const usecase = new AddClientUseCase(repository);

    const input = {
      name: 'John Doe',
      document: '00000000000',
      email: 'john@email.com',
      address: {
        street: 'Street 1',
        number: '123',
        complement: 'Complement 1',
        city: 'City 1',
        state: 'State 1',
        zipCode: '12345678',
      },
    };

    const result = await usecase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.email).toEqual(input.email);
    expect(result.address.street).toEqual(input.address.street);
    expect(result.address.number).toEqual(input.address.number);
    expect(result.address.complement).toEqual(input.address.complement);
    expect(result.address.city).toEqual(input.address.city);
    expect(result.address.state).toEqual(input.address.state);
    expect(result.address.zipCode).toEqual(input.address.zipCode);
  });
});
