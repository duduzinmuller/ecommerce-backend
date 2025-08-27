import { ZodError } from "zod";
import { HttpRequest } from "../../interfaces/httpRequest";
import { updateCartItemSchema } from "../../schema/cart-item";
import { UpdateCartItemUseCase } from "../../use-cases/cart-items/update-cart-item";

import { badRequest, ok, notFound, serverError } from "../helpers/http";

export class UpdateCartItemController {
  constructor(private updateCartItemUseCase: UpdateCartItemUseCase) {
    this.updateCartItemUseCase = updateCartItemUseCase;
  }

  async execute(httpRequest: HttpRequest) {
    try {
      const itemId = httpRequest.params?.itemId;
      const params = httpRequest.body;

      if (!itemId) {
        return badRequest("ID do item é obrigatório");
      }

      await updateCartItemSchema.parse(params);

      const cartItem = await this.updateCartItemUseCase.execute(itemId, params);

      if (!cartItem) {
        return notFound("Item do carrinho não encontrado");
      }

      return ok(cartItem);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.issues[0]?.message);
      }
      console.error(error);
      return serverError();
    }
  }
}
