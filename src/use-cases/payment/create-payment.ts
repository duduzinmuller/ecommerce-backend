import { IdGeneratorAdapter } from "../../adapters/id-generator";
import { MethodPaymentNotError } from "../../error/payment";
import { SendStatus } from "../../interfaces/email-notification";
import { Payment } from "../../interfaces/payment";
import { CreateEmailNotificationRepository } from "../../repositories/email-notifications/create-email-notification";
import { CreatePaymentRepository } from "../../repositories/payments/create-payment";
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
    const paymentId = await this.idGeneratorAdapter.execute();

    let strategy;
    switch (createPaymentParams.method) {
      case "boleto":
        strategy = new BoletoPayment(this.createPaymentRepository);
        break;
      case "credit_card":
        strategy = new CardPayment(this.createPaymentRepository);
        break;
      case "pix":
        strategy = new PixPayment(this.createPaymentRepository);
        break;
      default:
        throw new MethodPaymentNotError();
    }

    const [createdPayment] = await strategy.execute({
      ...createPaymentParams,
      id: paymentId,
    });

    const emailNotification = {
      id: await this.idGeneratorAdapter.execute(),
      recipient: createPaymentParams.user_id,
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
