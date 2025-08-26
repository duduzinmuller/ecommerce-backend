import { HttpRequest } from "../../interfaces/httpRequest";
import { GetCartByIdUseCase } from "../../use-cases/carts/get-cart-by-id";
import { notFound, ok, serverError } from "../helpers/http";
import { requiredCartIdResponse } from "../helpers/validation";

export class GetCartByIdController {
  constructor(private getCartByIdUseCase: GetCartByIdUseCase) {
    this.getCartByIdUseCase = getCartByIdUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const cartId = httpRequest.params?.cartId;

      if (!cartId) {
        return requiredCartIdResponse();
      }

      const getCartById = await this.getCartByIdUseCase.execute(cartId);

      if (!getCartById) {
        return notFound("Carrinho não encontrado");
      }

      return ok(getCartById);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
