import express, { Request, Response } from 'express';
import * as yup from 'yup';
import { Validator } from '../validator/validator';
import PlaceOrderUsecase from '../../modules/checkout/usecase/place-order/place-order.usecase';
import ClientAdmFacadeFactory from '../../modules/client-adm/factory/facade.factory';
import ProductAdmFacadeFactory from '../../modules/product-adm/factory/facade.factory';
import StoreCatalogFacadeFactory from '../../modules/store-catalog/factory/facade.factory';
import InvoiceFacadeFactory from '../../modules/invoice/factory/facade.factory';
import PaymentFacadeFactory from '../../modules/payment/factory/payment.factory';
import OrderRepository from '../../modules/checkout/repository/order.repository';

export const checkoutRoute = express.Router();

const checkoutSchema = yup.object().shape({
  clientId: yup.string().required(),
  products: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup.string().required(),
      }),
    )
    .min(1)
    .required(),
});

checkoutRoute.post(
  '/',
  Validator(checkoutSchema),
  async (req: Request, res: Response) => {
    const useCase = new PlaceOrderUsecase(
      ClientAdmFacadeFactory.create(),
      ProductAdmFacadeFactory.create(),
      StoreCatalogFacadeFactory.create(),
      new OrderRepository(),
      InvoiceFacadeFactory.create(),
      PaymentFacadeFactory.create(),
    );

    const checkoutDto = {
      clientId: req.body.clientId,
      products: req.body.products,
    };

    try {
      const output = await useCase.execute(checkoutDto);
      res.send(output);
    } catch (e) {
      res.status(500).send(e);
    }
  },
);
