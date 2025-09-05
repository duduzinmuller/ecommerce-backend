import { Payment } from "../../interfaces/payment";
import { CreatePaymentRepository } from "../../repositories/payments/create-payment";

export class CardPayment {
  constructor(private createPaymentRepository: CreatePaymentRepository) {
    this.createPaymentRepository = createPaymentRepository;
  }

  async execute(params: Payment) {
    const cardData = {
      ...params,
      billing_type: "CREDIT_CARD",
      card_last_digits: params.card_last_digits,
      card_holder_name: params.card_holder_name,
      card_expiry_month: params.card_expiry_month,
      card_expiry_year: params.card_expiry_year,
    };

    const creditCardPayment =
      await this.createPaymentRepository.execute(cardData);

    return creditCardPayment;
  }
}
