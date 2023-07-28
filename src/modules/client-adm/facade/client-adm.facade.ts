import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from './client-adm.facade.interface';

export interface UseCaseProps {
  addUsecase: UseCaseInterface;
  findUsecase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _addUsecase: UseCaseInterface;
  private _findUsecase: UseCaseInterface;

  constructor(useCaseProps: UseCaseProps) {
    this._addUsecase = useCaseProps.addUsecase;
    this._findUsecase = useCaseProps.findUsecase;
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this._addUsecase.execute(input);
  }

  async find(
    input: FindClientFacadeInputDto,
  ): Promise<FindClientFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }
}
