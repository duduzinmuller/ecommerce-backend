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
      console.error(error);

      if (error instanceof Error) {
        return badRequest(error.message);
      }

      return serverError();
    }
  }
}
