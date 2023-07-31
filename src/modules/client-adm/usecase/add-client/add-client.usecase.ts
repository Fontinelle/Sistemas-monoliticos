import Id from '../../../@shared/domain/value-object/id.value-object';
import Address from '../../../@shared/value-object/address';
import Client from '../../domain/client.entity';
import ClientGateway from '../../gateway/client.gateway';
import {
  AddClientInputDto,
  AddClientOutputDto,
} from './add-client.usecase.dto';

export default class AddClientUseCase {
  private _clientGateway: ClientGateway;

  constructor(clientGateway: ClientGateway) {
    this._clientGateway = clientGateway;
  }

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    const props = {
      id: new Id(input.id) || new Id(),
      name: input.name,
      document: input.document,
      email: input.email,
      address: new Address(input.address),
    };

    const client = new Client(props);
    this._clientGateway.add(client);

    return {
      id: client.id.id,
      name: client.name,
      document: client.document,
      email: client.email,
      address: {
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
      },
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
