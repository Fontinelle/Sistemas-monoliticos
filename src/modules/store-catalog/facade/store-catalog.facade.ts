import FindAllProductsUsecase from '../usecase/find-all-products/find-all-product.usecase';
import FindProductUsecase from '../usecase/find-product/find-product.usecase';
import StoreCatalogFacadeInterface, {
  FindAllStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
} from './store-catalog.facade.interface';

export interface UseCaseProps {
  findUsecase: FindProductUsecase;
  findAllUsecase: FindAllProductsUsecase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findUsecase: FindProductUsecase;
  private _findAllUsecase: FindAllProductsUsecase;

  constructor(props: UseCaseProps) {
    this._findUsecase = props.findUsecase;
    this._findAllUsecase = props.findAllUsecase;
  }

  async find(
    id: FindStoreCatalogFacadeInputDto,
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    return await this._findUsecase.execute(id);
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return await this._findAllUsecase.execute();
  }
}
