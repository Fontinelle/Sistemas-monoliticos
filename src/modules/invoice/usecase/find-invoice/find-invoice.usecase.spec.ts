import Id from '../../../@shared/domain/value-object/id.value-object';
import Invoice from '../../domain/invoice.entity';
import Product from '../../domain/product.entity';
import Address from '../../../@shared/value-object/address';
import FindInvoiceUsecase from './find-invoice.usecase';

const input = {
  id: '1',
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

const address = new Address({
  street: input.street,
  number: input.number,
  complement: input.complement,
  city: input.city,
  state: input.state,
  zipCode: input.zipCode,
});

const invoice = new Invoice({
  name: input.name,
  document: input.document,
  address: address,
  items: input.items.map(item => {
    return new Product({
      id: new Id(item.id),
      name: item.name,
      price: item.price,
    });
  }),
});

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe('Find Invoice Usecase unit test', () => {
  it('should find an invoice', async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUsecase(repository);

    const result = await usecase.execute({ id: '1' });

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.address.street).toEqual(input.street);
    expect(result.address.number).toEqual(input.number);
    expect(result.address.complement).toEqual(input.complement);
    expect(result.address.city).toEqual(input.city);
    expect(result.address.state).toEqual(input.state);
    expect(result.address.zipCode).toEqual(input.zipCode);
    expect(result.items[0].id).toEqual('1');
    expect(result.items[0].name).toEqual('Item 1');
    expect(result.items[0].price).toEqual(10);
    expect(result.items[1].id).toEqual('2');
    expect(result.items[1].name).toEqual('Item 2');
    expect(result.items[1].price).toEqual(20);
    expect(result.total).toEqual(30);
  });
});
