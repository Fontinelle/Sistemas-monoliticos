import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import PaymentFacadeInterface, {
  PaymentFacadeInputDto,
  PaymentFacadeOutputDto,
} from './facade.interface';

export default class PaymentFacade implements PaymentFacadeInterface {
  constructor(private processPaymentUsecase: UseCaseInterface) {}

  processPayment(
    input: PaymentFacadeInputDto,
  ): Promise<PaymentFacadeOutputDto> {
    return this.processPaymentUsecase.execute(input);
  }
}
