import StoreCatalogFacade from '../facade/store-catalog.facade';
import ProductRepository from '../repository/product.repository';
import FindAllProductsUsecase from '../usecase/find-all-products/find-all-product.usecase';
import FindProductUsecase from '../usecase/find-product/find-product.usecase';

export default class StoreCatalogFacadeFactory {
  static create(): StoreCatalogFacade {
    const productRepository = new ProductRepository();
    const findUsecase = new FindProductUsecase(productRepository);
    const findAllUsecase = new FindAllProductsUsecase(productRepository);

    const facede = new StoreCatalogFacade({
      findUsecase: findUsecase,
      findAllUsecase: findAllUsecase,
    });

    return facede;
  }
}
