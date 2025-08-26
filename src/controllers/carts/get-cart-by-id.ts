import { HttpRequest } from "../../interfaces/httpRequest";
import { GetCartByIdUseCase } from "../../use-cases/carts/get-cart-by-id";
import { notFound, ok, serverError, forbidden } from "../helpers/http";
import { requiredCartIdResponse } from "../helpers/validation";

export class GetCartByIdController {
  constructor(private getCartByIdRepository: GetCartByIdUseCase) {
    this.getCartByIdRepository = getCartByIdRepository;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const cartId = httpRequest.params?.cartId;
      const userId = httpRequest.userId;

      if (!cartId) {
        return requiredCartIdResponse();
      }

      const getCartById = await this.getCartByIdRepository.execute(cartId);

      if (!getCartById) {
        return notFound("Carrinho não encontrado");
      }

      if (getCartById.user_id !== userId) {
        return forbidden("Você não tem permissão para acessar este carrinho");
      }

      return ok(getCartById);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
