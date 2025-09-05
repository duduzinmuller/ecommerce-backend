import { IdGeneratorAdapter } from "../../adapters/id-generator";
import { asaas } from "../../config/assas";
import { MethodPaymentNotError } from "../../error/payment";
import { SendStatus } from "../../interfaces/email-notification";
import { Payment } from "../../interfaces/payment";
import { CreateEmailNotificationRepository } from "../../repositories/email-notifications/create-email-notification";
import { CreatePaymentRepository } from "../../repositories/payments/create-payment";
import { GetOrderByIdRepository } from "../../repositories/orders/get-order-by-id";
import { PaymentBaseSchema } from "../../schema/payment";
import { BoletoPayment } from "../strategies/boleto-payment";
import { CardPayment } from "../strategies/credit-card-payment";
import { PixPayment } from "../strategies/pix-payment";

export class CreatePaymentUseCase {
  constructor(
    private createPaymentRepository: CreatePaymentRepository,
    private createEmailNotificationRepository: CreateEmailNotificationRepository,
    private getOrderByIdRepository: GetOrderByIdRepository,
    private idGeneratorAdapter: IdGeneratorAdapter,
  ) {
    this.createPaymentRepository = createPaymentRepository;
    this.createEmailNotificationRepository = createEmailNotificationRepository;
    this.getOrderByIdRepository = getOrderByIdRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }
  async execute(createPaymentParams: Payment) {
    const validatedPayment = PaymentBaseSchema.parse(createPaymentParams);

    const order = await this.getOrderByIdRepository.execute(
      validatedPayment.order_id,
    );
    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    const paymentId = await this.idGeneratorAdapter.execute();
    const totalValue = parseFloat(order.total);

    console.log("🔍 Debug Payment:", {
      orderId: validatedPayment.order_id,
      customerId: validatedPayment.asaas_customer_id,
      method: validatedPayment.method,
      totalValue,
      orderTotal: order.total,
    });

    if (!validatedPayment.asaas_customer_id) {
      throw new Error(
        "Customer ID do Asaas é obrigatório para criar pagamento",
      );
    }

    let strategy;
    let asaasPayment;

    switch (validatedPayment.method) {
      case "boleto":
        const boletoData: any = {
          customer: validatedPayment.asaas_customer_id,
          billingType: "BOLETO",
          value: totalValue,
          dueDate: validatedPayment.due_date
            ? new Date(validatedPayment.due_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          description: `Pagamento do pedido ${validatedPayment.order_id}`,
        };

        if (
          validatedPayment.installment_count &&
          validatedPayment.installment_value
        ) {
          boletoData.installmentCount = validatedPayment.installment_count;
          boletoData.installmentValue = validatedPayment.installment_value;
        }

        asaasPayment = await asaas.payments.new(boletoData);
        strategy = new BoletoPayment(this.createPaymentRepository);
        break;

      case "credit_card":
        const cardData: any = {
          customer: validatedPayment.asaas_customer_id,
          billingType: "CREDIT_CARD",
          value: totalValue,
          dueDate: new Date().toISOString().split("T")[0],
          creditCard: {
            holderName: validatedPayment.card_holder_name,
            number: validatedPayment.card_number,
            expiryMonth: validatedPayment.card_expiry_month,
            expiryYear: validatedPayment.card_expiry_year,
            ccv: validatedPayment.card_cvv,
          },
        };

        if (validatedPayment.holder_name) {
          cardData.creditCardHolderInfo = {
            name: validatedPayment.holder_name,
            email: validatedPayment.holder_email,
            cpfCnpj: validatedPayment.holder_cpf_cnpj,
            postalCode: validatedPayment.holder_postal_code,
            addressNumber: validatedPayment.holder_address_number,
            addressComplement: validatedPayment.holder_address_complement,
            phone: validatedPayment.holder_phone,
            mobilePhone: validatedPayment.holder_mobile_phone,
          };
          cardData.remoteIp = validatedPayment.remote_ip;
        }

        asaasPayment = await asaas.payments.new(cardData);
        strategy = new CardPayment(this.createPaymentRepository);
        break;

      case "pix":
        const pixData: any = {
          customer: validatedPayment.asaas_customer_id,
          billingType: "PIX",
          value: totalValue,
          dueDate: new Date().toISOString().split("T")[0],
        };

        if (validatedPayment.pix_key) {
          pixData.pixAddressKey = validatedPayment.pix_key;
        }

        asaasPayment = await asaas.payments.new(pixData);
        strategy = new PixPayment(this.createPaymentRepository);
        break;

      default:
        throw new MethodPaymentNotError();
    }

    const [createdPayment] = await strategy.execute({
      id: paymentId,
      order_id: order.id,
      user_id: order.user_id,
      method: validatedPayment.method,
      status: asaasPayment.status?.toLowerCase() as
        | "pending"
        | "paid"
        | "failed"
        | "refunded",
      value: order.total,
      asaas_payment_id: asaasPayment.id,
      asaas_customer_id: validatedPayment.asaas_customer_id,
      billing_type: validatedPayment.method.toUpperCase(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    const emailNotification = {
      id: await this.idGeneratorAdapter.execute(),
      recipient: order.user_id,
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
