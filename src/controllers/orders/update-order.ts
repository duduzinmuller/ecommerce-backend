import { ZodError } from "zod";
import { HttpRequest } from "../../interfaces/httpRequest";
import { updateOrderSchema } from "../../schema/order";
import { UpdateOrderUseCase } from "../../use-cases/orders/update-order";
import { badRequest, ok, serverError } from "../helpers/http";
import { OrderNotFoundOrUnauthorizedError } from "../../error/order";

export class UpdateOrderController {
  constructor(private updateOrderUseCase: UpdateOrderUseCase) {
    this.updateOrderUseCase = updateOrderUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const orderId = httpRequest.params?.orderId;
      const userId = httpRequest.body?.user_id;

      if (!orderId) {
        return badRequest("O ID é obrigatório.");
      }
      if (!userId) {
        return badRequest("ID do usuário não fornecido");
      }

      const params = httpRequest.body;

      await updateOrderSchema.parse(params);

      const updatedOrder = await this.updateOrderUseCase.execute(
        userId,
        orderId,
        params,
      );

      return ok(updatedOrder);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.issues[0]?.message);
      }
      if (error instanceof OrderNotFoundOrUnauthorizedError) {
        return badRequest(error.message);
      }
      console.error(error);
      return serverError();
    }
  }
}
