import { HttpRequest } from "../../interfaces/httpRequest";
import { GetCartItemsUseCase } from "../../use-cases/cart-items/get-cart-items";
import { badRequest, ok, serverError } from "../helpers/http";

export class GetCartItemsController {
  constructor(private getCartItemsUseCase: GetCartItemsUseCase) {
    this.getCartItemsUseCase = getCartItemsUseCase;
  }

  async execute(httpRequest: HttpRequest) {
    try {
      const cartId = httpRequest.params?.cartId;

      if (!cartId) {
        return badRequest("ID do carrinho é obrigatório");
      }

      const cartItems = await this.getCartItemsUseCase.execute(cartId);

      return ok(cartItems);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
