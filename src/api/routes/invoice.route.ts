import express, { Request, Response } from 'express';
import FindInvoiceUsecase from '../../modules/invoice/usecase/find-invoice/find-invoice.usecase';
import InvoiceRepository from '../../modules/invoice/repository/invoice.repository';

export const invoiceRoute = express.Router();

invoiceRoute.get('/:id', async (req: Request, res: Response) => {
  const useCase = new FindInvoiceUsecase(new InvoiceRepository());

  const invoiceDto = {
    id: String(req.params.id),
  };

  try {
    const output = await useCase.execute(invoiceDto);
    res.send(output);
  } catch (e) {
    res.status(500).send(e);
  }
});
