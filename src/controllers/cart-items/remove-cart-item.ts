import { HttpRequest } from "../../interfaces/httpRequest";
import { RemoveCartItemUseCase } from "../../use-cases/cart-items/remove-cart-item";
import { badRequest, notFound, ok, serverError } from "../helpers/http";

export class RemoveCartItemController {
  constructor(private removeCartItemUseCase: RemoveCartItemUseCase) {
    this.removeCartItemUseCase = removeCartItemUseCase;
  }

  async execute(httpRequest: HttpRequest) {
    try {
      const itemId = httpRequest.params?.itemId;

      if (!itemId) {
        return badRequest("ID do item é obrigatório");
      }

      const removedCartItem = await this.removeCartItemUseCase.execute(itemId);

      if (!removedCartItem) {
        return notFound("Cart Item não encontrado");
      }

      return ok(removedCartItem);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
