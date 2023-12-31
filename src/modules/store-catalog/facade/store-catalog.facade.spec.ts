import { Sequelize } from 'sequelize-typescript';
import { ProductStoreCatalogModel } from '../repository/product.model';
import StoreCatalogFacadeFactory from '../factory/facade.factory';

describe('Store catalog facade test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductStoreCatalogModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should find all products', async () => {
    const facede = StoreCatalogFacadeFactory.create();
    await ProductStoreCatalogModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      salesPrice: 100,
    });

    await ProductStoreCatalogModel.create({
      id: '2',
      name: 'Product 2',
      description: 'Product 2 description',
      salesPrice: 200,
    });

    const result = await facede.findAll();

    expect(result.products.length).toEqual(2);
    expect(result.products[0].id).toEqual('1');
    expect(result.products[0].name).toEqual('Product 1');
    expect(result.products[0].description).toEqual('Product 1 description');
    expect(result.products[0].salesPrice).toEqual(100);
    expect(result.products[1].id).toEqual('2');
    expect(result.products[1].name).toEqual('Product 2');
    expect(result.products[1].description).toEqual('Product 2 description');
    expect(result.products[1].salesPrice).toEqual(200);
  });

  it('should find a product', async () => {
    const facade = StoreCatalogFacadeFactory.create();
    await ProductStoreCatalogModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      salesPrice: 100,
    });

    const result = await facade.find({ id: '1' });

    expect(result.id).toBe('1');
    expect(result.name).toBe('Product 1');
    expect(result.description).toBe('Product 1 description');
    expect(result.salesPrice).toBe(100);
  });
});
