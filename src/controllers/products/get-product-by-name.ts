import { HttpRequest } from "../../interfaces/httpRequest";
import { GetProductByNameUseCase } from "../../use-cases/products/get-product-by-name";
import { badRequest, notFound, ok, serverError } from "../helpers/http";

export class GetProductByNameController {
  constructor(private getProductByNameUseCase: GetProductByNameUseCase) {
    this.getProductByNameUseCase = getProductByNameUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const productName = httpRequest.query?.productName;

      if (!productName) {
        return badRequest("O nome do produto é obrigatório.");
      }

      const getProductByName =
        await this.getProductByNameUseCase.execute(productName);

      if (!getProductByName) {
        return notFound("Produto não encontrado");
      }

      return ok(getProductByName);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
