import { IdGeneratorAdapter } from "../adapters/id-generator";
import { CreatePaymentController } from "../controllers/payment/create-payment";
import { CreateEmailNotificationRepository } from "../repositories/email-notifications/create-email-notification";
import { CreatePaymentRepository } from "../repositories/payments/create-payment";
import { GetOrderByIdRepository } from "../repositories/orders/get-order-by-id";
import { CreatePaymentUseCase } from "../use-cases/payment/create-payment";

export const MakeCreatePaymentController = () => {
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const createPaymentRepository = new CreatePaymentRepository();
  const createEmailNotificationRepository =
    new CreateEmailNotificationRepository();
  const getOrderByIdRepository = new GetOrderByIdRepository();
  const createPaymentUseCase = new CreatePaymentUseCase(
    createPaymentRepository,
    createEmailNotificationRepository,
    getOrderByIdRepository,
    idGeneratorAdapter,
  );
  const createPaymentController = new CreatePaymentController(
    createPaymentUseCase,
  );
  return createPaymentController;
};
