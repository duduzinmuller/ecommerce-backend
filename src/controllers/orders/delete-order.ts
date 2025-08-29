import { HttpRequest } from "../../interfaces/httpRequest";
import { DeleteOrderUseCase } from "../../use-cases/orders/delete-order";
import { badRequest, notFound, ok, serverError } from "../helpers/http";

export class DeleteOrderController {
  constructor(private deleteOrderUseCase: DeleteOrderUseCase) {
    this.deleteOrderUseCase = deleteOrderUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const orderId = httpRequest.params?.orderId;

      if (!orderId) {
        return badRequest("O ID é obrigatório");
      }

      const deletedOrder = await this.deleteOrderUseCase.execute(orderId);

      if (!deletedOrder) {
        return notFound("Pedido não encontrado");
      }

      return ok(deletedOrder);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
