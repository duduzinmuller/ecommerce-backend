import { Payment } from "../../interfaces/payment";
import { CreatePaymentRepository } from "../../repositories/payments/create-payment";

export class PixPayment {
  constructor(private createPaymentRepository: CreatePaymentRepository) {
    this.createPaymentRepository = createPaymentRepository;
  }
  async execute(params: Payment) {
    const pixData = {
      ...params,
      billing_type: "PIX",
      pix_key: params.pix_key,
      pix_qr_code: params.pix_qr_code,
      pix_expiration_date: new Date(Date.now() + 30 * 60 * 1000),
    };

    const pixPayment = await this.createPaymentRepository.execute(pixData);

    return pixPayment;
  }
}
