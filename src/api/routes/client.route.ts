import express, { Request, Response } from 'express';
import * as yup from 'yup';
import { Validator } from '../validator/validator';
import AddClientUseCase from '../../modules/client-adm/usecase/add-client/add-client.usecase';
import ClientRepository from '../../modules/client-adm/repository/client.repository';

export const clientRoute = express.Router();

const clientSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  document: yup.string().required('Document is required'),
  email: yup.string().email().required('Email is required'),
  address: yup.object().shape({
    street: yup.string().required('Street is required'),
    number: yup.string().required('Number is required'),
    complement: yup.string().required('Complement is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Zip code is required'),
  }),
});

clientRoute.post(
  '/',
  Validator(clientSchema),
  async (req: Request, res: Response) => {
    const useCase = new AddClientUseCase(new ClientRepository());

    try {
      const clientDto = {
        id: req.body.id,
        name: req.body.name,
        document: req.body.document,
        email: req.body.email,
        address: {
          street: req.body.address.street,
          number: req.body.address.number,
          complement: req.body.address.complement,
          city: req.body.address.city,
          state: req.body.address.state,
          zipCode: req.body.address.zipCode,
        },
      };

      const output = await useCase.execute(clientDto);
      res.send(output);
    } catch (e) {
      res.status(500).send(e);
    }
  },
);
