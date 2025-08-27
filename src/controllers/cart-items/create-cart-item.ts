import { ZodError } from "zod";
import {
  IdCartAndProductId,
  QuantityProductError,
} from "../../error/cart-item";
import { HttpRequest } from "../../interfaces/httpRequest";
import { createCartItemSchema } from "../../schema/cart-item";
import { CreateCartItemUseCase } from "../../use-cases/cart-items/create-cart-item";
import { badRequest, created, serverError } from "../helpers/http";

export class CreateCartItemController {
  constructor(private createCartItemUseCase: CreateCartItemUseCase) {
    this.createCartItemUseCase = createCartItemUseCase;
  }

  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      await createCartItemSchema.parse(params);

      const cartItem = await this.createCartItemUseCase.execute(params);

      return created(cartItem);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.issues[0]?.message);
      }
      if (error instanceof IdCartAndProductId) {
        return badRequest(error.message);
      }
      if (error instanceof QuantityProductError) {
        return badRequest(error.message);
      }
      console.error(error);
      return serverError();
    }
  }
}
