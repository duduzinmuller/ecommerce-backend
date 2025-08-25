import { HttpRequest } from "../../interfaces/httpRequest";
import { GetProductBySlugUseCase } from "../../use-cases/products/get-product-by-slug";
import { notFound, ok, serverError } from "../helpers/http";
import { invalidSlugResponse } from "../helpers/validation";

export class GetProductBySlugController {
  constructor(private getProductBySlugUseCase: GetProductBySlugUseCase) {
    this.getProductBySlugUseCase = getProductBySlugUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const slug = httpRequest.params?.slug;

      if (!slug) {
        return invalidSlugResponse();
      }

      const getProductBySlug = await this.getProductBySlugUseCase.execute(slug);

      if (!getProductBySlug) {
        return notFound("Produto não encontrado");
      }

      return ok(getProductBySlug);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
