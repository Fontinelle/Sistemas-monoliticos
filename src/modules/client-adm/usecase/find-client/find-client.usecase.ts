import ClientGateway from '../../gateway/client.gateway';
import {
  FindClientInputDto,
  FindClientOutputDto,
} from './find-client.usecase.dto';

export default class FindClientUseCase {
  private _clientGateway: ClientGateway;

  constructor(clientGateway: ClientGateway) {
    this._clientGateway = clientGateway;
  }

  async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {
    const client = await this._clientGateway.find(input.id);

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
