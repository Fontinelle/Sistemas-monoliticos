import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import ProductAdmFacadeInterface, {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from './product-adm.facade.interface';

export interface UseCaseProps {
  addUsecase: UseCaseInterface;
  checkStockUsecase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUsecase: UseCaseInterface;
  private _checkStockUsecase: UseCaseInterface;

  constructor(useCaseProps: UseCaseProps) {
    this._addUsecase = useCaseProps.addUsecase;
    this._checkStockUsecase = useCaseProps.checkStockUsecase;
  }

  addProduct(input: AddProductFacadeInputDto): Promise<void> {
    return this._addUsecase.execute(input);
  }

  checkStock(
    input: CheckStockFacadeInputDto,
  ): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUsecase.execute(input);
  }
}
