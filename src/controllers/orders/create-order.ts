import { ZodError } from "zod";
import { HttpRequest } from "../../interfaces/httpRequest";
import { CreateOrderUseCase } from "../../use-cases/orders/create-order";
import { badRequest, created, notFound, serverError } from "../helpers/http";
import { UserNotFoundError } from "../../error/user";
import { CartNotFoundError, EmptyCartError } from "../../error/cart-item";
import { createOrderSchema } from "../../schema/order";

export class CreateOrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {
    this.createOrderUseCase = createOrderUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      await createOrderSchema.parse(params);

      const createdOrder = await this.createOrderUseCase.execute(params);

      return created(createdOrder);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage =
          error.issues.length > 0 ? error.issues[0].message : "Dados inválidos";
        return badRequest(errorMessage);
      }
      if (error instanceof UserNotFoundError) {
        return notFound(error.message);
      }
      if (error instanceof CartNotFoundError) {
        return badRequest(error.message);
      }
      if (error instanceof EmptyCartError) {
        return badRequest(error.message);
      }
      console.error(error);
      return serverError();
    }
  }
}
