import GenerateInvoiceUsecase from './generate-invoice.usecase';

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe('Generate Invoice Usecase unit test', () => {
  it('should generate an invoice', async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUsecase(repository);

    const input = {
      name: 'Invoice',
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
          name: 'Item 1',
          price: 10,
        },
        {
          id: '2',
          name: 'Item 2',
          price: 20,
        },
      ],
    };

    const result = await usecase.execute(input);

    expect(repository.generate).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual(input.street);
    expect(result.number).toEqual(input.number);
    expect(result.complement).toEqual(input.complement);
    expect(result.city).toEqual(input.city);
    expect(result.state).toEqual(input.state);
    expect(result.zipCode).toEqual(input.zipCode);
    expect(result.items[0].id).toEqual('1');
    expect(result.items[0].name).toEqual('Item 1');
    expect(result.items[0].price).toEqual(10);
    expect(result.items[1].id).toEqual('2');
    expect(result.items[1].name).toEqual('Item 2');
    expect(result.items[1].price).toEqual(20);
    expect(result.total).toEqual(30);
  });
});
