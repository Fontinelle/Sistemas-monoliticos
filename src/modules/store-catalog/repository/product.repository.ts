import Id from '../../@shared/domain/value-object/id.value-object';
import Product from '../domain/product.entity';
import ProductGateway from '../gateway/product.gateway';
import { ProductStoreCatalogModel } from './product.model';

export default class ProductRepository implements ProductGateway {
  async find(id: string): Promise<Product> {
    const product = await ProductStoreCatalogModel.findOne({ where: { id } });

    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }

  async findAll(): Promise<Product[]> {
    const products = await ProductStoreCatalogModel.findAll();

    return products.map(product => {
      return new Product({
        id: new Id(product.id),
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      });
    });
  }
}
