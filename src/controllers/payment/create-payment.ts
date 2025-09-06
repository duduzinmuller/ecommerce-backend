import { ZodError } from "zod";
import { HttpRequest } from "../../interfaces/httpRequest";
import { PaymentBaseSchema } from "../../schema/payment";
import { CreatePaymentUseCase } from "../../use-cases/payment/create-payment";
import { badRequest, created, serverError } from "../helpers/http";
import { MethodPaymentNotError } from "../../error/payment";
import { OrderNotFoundOrUnauthorizedError } from "../../error/order";

export class CreatePaymentController {
  constructor(private createPaymentUseCase: CreatePaymentUseCase) {
    this.createPaymentUseCase = createPaymentUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      await PaymentBaseSchema.parse(params);

      const payment = await this.createPaymentUseCase.execute(params);

      return created(payment);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.issues[0]?.message);
      }
      if (error instanceof MethodPaymentNotError) {
        return badRequest(error.message);
      }
      if (error instanceof OrderNotFoundOrUnauthorizedError) {
        return badRequest(error.message);
      }
      console.error(error);
      return serverError();
    }
  }
}
