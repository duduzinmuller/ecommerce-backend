import { Payment } from "../../interfaces/payment";
import { CreatePaymentRepository } from "../../repositories/payments/create-payment";

export class BoletoPayment {
  constructor(private createPaymentRepository: CreatePaymentRepository) {
    this.createPaymentRepository = createPaymentRepository;
  }

  async execute(params: Payment) {
    const boletoData: Payment = {
      ...params,
      billing_type: "BOLETO",
      due_date:
        params.due_date ?? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };

    const boletoPayment =
      await this.createPaymentRepository.execute(boletoData);

    return boletoPayment;
  }
}
