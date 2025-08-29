import { HttpRequest } from "../../interfaces/httpRequest";
import { DeleteOrderUseCase } from "../../use-cases/orders/delete-order";
import { badRequest, notFound, ok, serverError } from "../helpers/http";
import { OrderNotFoundOrUnauthorizedError } from "../../error/order";

export class DeleteOrderController {
  constructor(private deleteOrderUseCase: DeleteOrderUseCase) {
    this.deleteOrderUseCase = deleteOrderUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const orderId = httpRequest.params?.orderId;
      const userId = httpRequest.body?.user_id;

      if (!orderId) {
        return badRequest("O ID é obrigatório");
      }
      if (!userId) {
        return badRequest("ID do usuário não fornecido");
      }

      const deletedOrder = await this.deleteOrderUseCase.execute(
        orderId,
        userId,
      );

      if (!deletedOrder) {
        return notFound("Pedido não encontrado");
      }

      return ok(deletedOrder);
    } catch (error) {
      if (error instanceof OrderNotFoundOrUnauthorizedError) {
        return badRequest(error.message);
      }
      console.error(error);
      return serverError();
    }
  }
}
