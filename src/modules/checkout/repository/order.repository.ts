import Id from '../../@shared/domain/value-object/id.value-object';
import Address from '../../@shared/value-object/address';
import { ClientModel } from '../../client-adm/repository/client.model';
import { ProductStoreCatalogModel } from '../../store-catalog/repository/product.model';
import Client from '../domain/client.entity';
import Order from '../domain/order.entity';
import Product from '../domain/product.entity';
import CheckoutGateway from '../gateway/checkout.gateway';
import { OrderModel } from './order.model';

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    try {
      await OrderModel.create(
        {
          id: order.id.id,
          client: {
            id: order.client.id.id,
            name: order.client.name,
            email: order.client.email,
            document: order.client.document,
            street: order.client.address.street,
            number: order.client.address.number,
            complement: order.client.address.complement,
            city: order.client.address.city,
            state: order.client.address.state,
            zipCode: order.client.address.zipCode,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          },
          products: order.products.map(p => {
            return {
              id: p.id.id,
              name: p.name,
              description: p.description,
              salesPrice: p.salesPrice,
            };
          }),
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
        { include: [ProductStoreCatalogModel, ClientModel] },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findOne({
      where: { id: id },
      include: [ProductStoreCatalogModel, ClientModel],
    });

    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(order.client.id),
        name: order.client.name,
        email: order.client.email,
        document: order.client.document,
        address: new Address({
          street: order.client.street,
          number: order.client.number,
          complement: order.client.complement,
          city: order.client.city,
          state: order.client.state,
          zipCode: order.client.zipCode,
        }),
      }),
      products: order.products.map(p => {
        return new Product({
          id: new Id(p.id),
          name: p.name,
          description: p.description,
          salesPrice: p.salesPrice,
        });
      }),
      status: order.status,
    });
  }
}
