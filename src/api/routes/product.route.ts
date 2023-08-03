import express, { Request, Response } from 'express';
import * as yup from 'yup';
import { Validator } from '../validator/validator';
import AddProductUsecase from '../../modules/product-adm/usecase/add-product/add-product.usecase';
import ProductRepository from '../../modules/product-adm/repository/product.repository';

export const productRoute = express.Router();

const productSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  purchasePrice: yup.number().required('Purchase price is required'),
  stock: yup.number().required('Stock is required'),
});

productRoute.post(
  '/',
  Validator(productSchema),
  async (req: Request, res: Response) => {
    const useCase = new AddProductUsecase(new ProductRepository());

    try {
      const productDto = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        purchasePrice: req.body.purchasePrice,
        stock: req.body.stock,
      };
      const output = await useCase.execute(productDto);
      res.send(output);
    } catch (e) {
      res.status(500).send(e);
    }
  },
);
