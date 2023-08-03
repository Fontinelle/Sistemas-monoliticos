import * as yup from 'yup';
import { Request, Response } from 'express';

export const Validator =
  (schema: yup.ObjectSchema<any>) =>
  async (req: Request, res: Response, next: any) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (errors) {
      const e = errors as yup.ValidationError;
      res.status(400).send({ errors: e.errors });
    }
  };
