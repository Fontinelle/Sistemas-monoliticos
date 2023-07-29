import Id from '../../../@shared/domain/value-object/id.value-object';
import Invoice from '../../domain/invoice.entity';
import Product from '../../domain/product.entity';
import InvoiceGateway from '../../gateway/invoice.gateway';
import Address from '../../value-object/address';
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from './generate-invoice.usecase.dto';

export default class GenerateInvoiceUsecase {
  private _invoiceGateway: InvoiceGateway;

  constructor(invoiceGateway: InvoiceGateway) {
    this._invoiceGateway = invoiceGateway;
  }

  async execute(
    input: GenerateInvoiceUseCaseInputDto,
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
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

    await this._invoiceGateway.generate(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map(item => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
        };
      }),
      total: invoice.total(),
    };
  }
}
