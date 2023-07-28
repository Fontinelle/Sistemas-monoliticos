import Id from '../../../@shared/domain/value-object/id.value-object';
import Product from '../../domain/product.entity';
import FindAllProductsUsecase from './find-all-product.usecase';

const product = new Product({
  id: new Id('1'),
  name: 'Product 1',
  description: 'Product 1 description',
  salesPrice: 100,
});

const product2 = new Product({
  id: new Id('2'),
  name: 'Product 2',
  description: 'Product 2 description',
  salesPrice: 200,
});

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2])),
  };
};

describe('Find all products use case unit test', () => {
  it('should find all products', async () => {
    const productRepository = MockRepository();
    const usecase = new FindAllProductsUsecase(productRepository);

    const result = await usecase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();
    expect(result.products.length).toEqual(2);
    expect(result.products[0].id).toEqual(product.id.id);
    expect(result.products[0].name).toEqual(product.name);
    expect(result.products[0].description).toEqual(product.description);
    expect(result.products[0].salesPrice).toEqual(product.salesPrice);
    expect(result.products[1].id).toEqual(product2.id.id);
    expect(result.products[1].name).toEqual(product2.name);
    expect(result.products[1].description).toEqual(product2.description);
    expect(result.products[1].salesPrice).toEqual(product2.salesPrice);
  });
});
