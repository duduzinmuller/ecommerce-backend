import { HttpRequest } from "../../interfaces/httpRequest";
import { GetCartByUserIdUseCase } from "../../use-cases/carts/get-cart-by-user-id";
import { notFound, ok, serverError } from "../helpers/http";

export class GetCartByUserIdController {
  constructor(private getCartByUserIdUseCase: GetCartByUserIdUseCase) {
    this.getCartByUserIdUseCase = getCartByUserIdUseCase;
  }

  async execute(httpRequest: HttpRequest) {
    try {
      const userId = httpRequest.body?.user_id;

      if (!userId) {
        return notFound("ID do usuário não fornecido");
      }

      const cart = await this.getCartByUserIdUseCase.execute(userId);

      if (!cart) {
        return notFound("Carrinho não encontrado para este usuário");
      }

      return ok(cart);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
