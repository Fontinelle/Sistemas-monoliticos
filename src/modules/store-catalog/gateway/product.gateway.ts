import Product from '../domain/product.entity';

export default interface ProductGateway {
  find(id: string): Promise<Product>;
  findAll(): Promise<Product[]>;
}
