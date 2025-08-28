import { HttpRequest } from "../../interfaces/httpRequest";
import { GetOrderByUserIdUseCase } from "../../use-cases/orders/get-order-by-user-id";
import { badRequest, notFound, ok, serverError } from "../helpers/http";

export class GetOrderByUserIdController {
  constructor(private getOrderByUserIdUseCase: GetOrderByUserIdUseCase) {
    this.getOrderByUserIdUseCase = getOrderByUserIdUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const userId = httpRequest.body?.user_id;

      if (!userId) {
        return badRequest("ID do usuário não fornecido");
      }

      const order = await this.getOrderByUserIdUseCase.execute(userId);

      if (!order) {
        return notFound("Pedido não encontrado para este usuário");
      }

      return ok(order);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
