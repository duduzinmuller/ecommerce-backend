import { HttpRequest } from "../../interfaces/httpRequest";
import { GetProductUseCase } from "../../use-cases/products/get-product";
import { ok, serverError } from "../helpers/http";

export class GetProductController {
  constructor(private getProductUseCase: GetProductUseCase) {
    this.getProductUseCase = getProductUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const getProducts = await this.getProductUseCase.execute();

      return ok(getProducts);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
