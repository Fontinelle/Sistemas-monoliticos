import Id from '../../../@shared/domain/value-object/id.value-object';
import Product from '../../domain/product.entity';
import { PlaceOrderInputDto } from './place-order.dto';
import PlaceOrderUsecase from './place-order.usecase';

const mockDate = new Date(2023, 1, 1);

describe('PlaceOrderUseCase unit test', () => {
  describe('validateProducts method', () => {
    //@ts-expect-error - no params in constructor
    const placeOrderUsecase = new PlaceOrderUsecase();

    it('should throw erro if no products are selected', async () => {
      const input: PlaceOrderInputDto = { clientId: '0', products: [] };

      await expect(
        placeOrderUsecase['validateProducts'](input),
      ).rejects.toThrow(new Error('No products selected'));
    });

    it('should throw an error when products is out of stock', async () => {
      const mockClientFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({ productId, stock: productId === '1' ? 0 : 1 }),
        ),
      };

      //@ts-expect-error - force set productFacade
      placeOrderUsecase['_productFacade'] = mockClientFacade;

      let input: PlaceOrderInputDto = {
        clientId: '0',
        products: [{ productId: '1' }],
      };

      await expect(
        placeOrderUsecase['validateProducts'](input),
      ).rejects.toThrow(new Error('Product 1 is not available in stock'));

      input = {
        clientId: '0',
        products: [{ productId: '0' }, { productId: '1' }],
      };

      await expect(
        placeOrderUsecase['validateProducts'](input),
      ).rejects.toThrow(new Error('Product 1 is not available in stock'));
      expect(mockClientFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: '0',
        products: [{ productId: '0' }, { productId: '1' }, { productId: '2' }],
      };

      await expect(
        placeOrderUsecase['validateProducts'](input),
      ).rejects.toThrow(new Error('Product 1 is not available in stock'));
      expect(mockClientFacade.checkStock).toHaveBeenCalledTimes(5);
    });

    it('should throw an error when products are not valid', async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };

      //@ts-expect-error - no params in constructor
      const placeOrderUsecase = new PlaceOrderUsecase();

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUsecase, 'validateProducts')
        //@ts-expect-error - not return never
        .mockRejectedValue(new Error('No products selected'));

      //@ts-expect-error - force set clientFacade
      placeOrderUsecase['_clientFacade'] = mockClientFacade;

      const input: PlaceOrderInputDto = { clientId: '1', products: [] };

      await expect(placeOrderUsecase.execute(input)).rejects.toThrowError(
        new Error('No products selected'),
      );
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('execute method', () => {
    it('should throw an error when client not found', async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - no params in constructor
      const placeOrderUsecase = new PlaceOrderUsecase();

      //@ts-expect-error - force set clientFacade
      placeOrderUsecase['_clientFacade'] = mockClientFacade;

      const input: PlaceOrderInputDto = { clientId: '0', products: [] };

      await expect(placeOrderUsecase.execute(input)).rejects.toThrowError(
        new Error('Client not found'),
      );
    });
  });

  describe('getProducts method', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    //@ts-expect-error - no params in constructor
    const placeOrderUsecase = new PlaceOrderUsecase();

    it('should throw an error when products not found', async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUsecase['_catalogFacade'] = mockCatalogFacade;

      await expect(placeOrderUsecase['getProduct']('0')).rejects.toThrowError(
        new Error('Product not found'),
      );
    });

    it('should return a product', async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: '0',
          name: 'Product 0',
          description: 'Product 0 description',
          salesPrice: 0,
        }),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUsecase['_catalogFacade'] = mockCatalogFacade;

      await expect(placeOrderUsecase['getProduct']('0')).resolves.toEqual(
        new Product({
          id: new Id('0'),
          name: 'Product 0',
          description: 'Product 0 description',
          salesPrice: 0,
        }),
      );

      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('place an order', () => {
    const clientProps = {
      id: 'c1',
      name: 'Client 1',
      document: '00000000000',
      email: 'client@email.com',
      address: {
        street: 'street',
        number: '1',
        complement: 'complement',
        city: 'city',
        state: 'state',
        zipCode: '00000000',
      },
    };

    const mockClientFacade = {
      find: jest.fn().mockResolvedValue(clientProps),
    };

    const mockPaymentFacade = {
      processPayment: jest.fn(),
    };

    const mockCheckoutRepository = {
      addOrder: jest.fn(),
    };

    const mockInvoiceFacade = {
      generate: jest.fn().mockResolvedValue({ id: 'i1' }),
    };

    const placeOrderUsecase = new PlaceOrderUsecase(
      mockClientFacade as any,
      null,
      null,
      mockCheckoutRepository as any,
      mockInvoiceFacade as any,
      mockPaymentFacade,
    );

    const products = {
      '1': new Product({
        id: new Id('1'),
        name: 'Product 1',
        description: 'Product 1 description',
        salesPrice: 40,
      }),
      '2': new Product({
        id: new Id('2'),
        name: 'Product 2',
        description: 'Product 2 description',
        salesPrice: 50,
      }),
    };

    const mockValidateProducts = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOrderUsecase, 'validateProducts')
      //@ts-expect-error - spy on private method
      .mockResolvedValue(null);

    const mockGetProducts = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOrderUsecase, 'getProduct')
      //@ts-expect-error - spy on private method
      .mockImplementation((productId: keyof typeof products) => {
        return products[productId];
      });

    it('should not be approved', async () => {
      mockPaymentFacade.processPayment =
        mockPaymentFacade.processPayment.mockResolvedValue({
          transactionId: 't1',
          orderId: 'o1',
          amount: 100,
          status: 'error',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      const input: PlaceOrderInputDto = {
        clientId: 'c1',
        products: [{ productId: '1' }, { productId: '2' }],
      };

      let output = await placeOrderUsecase.execute(input);

      expect(output.invoiceId).toBeNull();
      expect(output.total).toBe(90);
      expect(output.products).toStrictEqual([
        { productId: '1' },
        { productId: '2' },
      ]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: 'c1' });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockValidateProducts).toHaveBeenCalledWith(input);
      expect(mockGetProducts).toHaveBeenCalledTimes(2);
      expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.processPayment).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.processPayment).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
    });

    it('should be approved', async () => {
      mockPaymentFacade.processPayment =
        mockPaymentFacade.processPayment.mockResolvedValue({
          transactionId: 't1',
          orderId: 'o1',
          amount: 100,
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      const input: PlaceOrderInputDto = {
        clientId: 'c1',
        products: [{ productId: '1' }, { productId: '2' }],
      };

      let output = await placeOrderUsecase.execute(input);

      expect(output.invoiceId).toBe('i1');
      expect(output.total).toBe(90);
      expect(output.products).toStrictEqual([
        { productId: '1' },
        { productId: '2' },
      ]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: 'c1' });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockGetProducts).toHaveBeenCalledTimes(2);
      expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.processPayment).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.processPayment).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
      expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
        name: clientProps.name,
        document: clientProps.document,
        street: clientProps.address.street,
        number: clientProps.address.number,
        complement: clientProps.address.complement,
        city: clientProps.address.city,
        state: clientProps.address.state,
        zipCode: clientProps.address.zipCode,
        items: [
          {
            id: products['1'].id.id,
            name: products['1'].name,
            price: products['1'].salesPrice,
          },
          {
            id: products['2'].id.id,
            name: products['2'].name,
            price: products['2'].salesPrice,
          },
        ],
      });
    });
  });
});
