import { IdGeneratorAdapter } from "../../adapters/id-generator";
import { asaas } from "../../config/assas";
import { MethodPaymentNotError } from "../../error/payment";
import { SendStatus } from "../../interfaces/email-notification";
import { Payment } from "../../interfaces/payment";
import { CreateEmailNotificationRepository } from "../../repositories/email-notifications/create-email-notification";
import { CreatePaymentRepository } from "../../repositories/payments/create-payment";
import { PaymentBaseSchema } from "../../schema/payment";
import { BoletoPayment } from "../strategies/boleto-payment";
import { CardPayment } from "../strategies/credit-card-payment";
import { PixPayment } from "../strategies/pix-payment";

export class CreatePaymentUseCase {
  constructor(
    private createPaymentRepository: CreatePaymentRepository,
    private createEmailNotificationRepository: CreateEmailNotificationRepository,
    private idGeneratorAdapter: IdGeneratorAdapter,
  ) {
    this.createPaymentRepository = createPaymentRepository;
    this.createEmailNotificationRepository = createEmailNotificationRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }
  async execute(createPaymentParams: Payment) {
    const validatedPayment = PaymentBaseSchema.parse(createPaymentParams);

    const paymentId = await this.idGeneratorAdapter.execute();

    let strategy;
    let asaasPayment;

    switch (validatedPayment.method) {
      case "boleto":
        asaasPayment = await asaas.payments.new({
          customer: validatedPayment.asaas_customer_id!,
          billingType: "BOLETO",
          value: parseFloat(validatedPayment.value),
          dueDate: validatedPayment.due_date!,
          description: `Pagamento do pedido ${validatedPayment.order_id}`,
        });
        strategy = new BoletoPayment(this.createPaymentRepository);
        break;

      case "credit_card":
        asaasPayment = await asaas.payments.new({
          customer: validatedPayment.asaas_customer_id!,
          billingType: "CREDIT_CARD",
          value: parseFloat(validatedPayment.value),
          dueDate: new Date(),
          creditCard: {
            holderName: validatedPayment.card_holder_name!,
            number: validatedPayment.card_last_digits!,
            expiryMonth: validatedPayment.card_expiry_month!,
            expiryYear: validatedPayment.card_expiry_year!,
          },
        });
        strategy = new CardPayment(this.createPaymentRepository);
        break;

      case "pix":
        asaasPayment = await asaas.payments.new({
          customer: validatedPayment.asaas_customer_id!,
          billingType: "PIX",
          value: parseFloat(validatedPayment.value),
          dueDate: new Date(),
        });
        strategy = new PixPayment(this.createPaymentRepository);
        break;

      default:
        throw new MethodPaymentNotError();
    }

    const [createdPayment] = await strategy.execute({
      ...validatedPayment,
      id: paymentId,
      value: validatedPayment.value,
      asaas_payment_id: asaasPayment.id,
      status: asaasPayment.status?.toLowerCase() as
        | "pending"
        | "paid"
        | "failed"
        | "refunded",
      created_at: new Date(),
      updated_at: new Date(),
    });

    const emailNotification = {
      id: await this.idGeneratorAdapter.execute(),
      recipient: validatedPayment.user_id,
      subject: "Pagamento recebido",
      content: `Seu pagamento ${createdPayment.id} está ${createdPayment.status}`,
      sent_at: new Date(),
      status: "pending" as SendStatus,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await this.createEmailNotificationRepository.execute(emailNotification);

    return createdPayment;
  }
}
