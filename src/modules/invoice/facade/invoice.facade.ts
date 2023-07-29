import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
} from './invoice.facade.interface';

export interface UseCaseProps {
  generateUsecase: UseCaseInterface;
  findUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateUsecase: UseCaseInterface;
  private _findUsecase: UseCaseInterface;

  constructor(useCaseProps: UseCaseProps) {
    this._generateUsecase = useCaseProps.generateUsecase;
    this._findUsecase = useCaseProps.findUsecase;
  }
  async find(
    input: FindInvoiceFacadeInputDTO,
  ): Promise<FindInvoiceFacadeOutputDTO> {
    return await this._findUsecase.execute(input);
  }

  async generate(input: GenerateInvoiceFacadeInputDto): Promise<void> {
    await this._generateUsecase.execute(input);
  }
}
