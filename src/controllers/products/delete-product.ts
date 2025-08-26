import { HttpRequest } from "../../interfaces/httpRequest";
import { DeleteProductUseCase } from "../../use-cases/products/delete-product";
import { notFound, ok, serverError } from "../helpers/http";
import { invalidSlugResponse } from "../helpers/validation";

export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {
    this.deleteProductUseCase = deleteProductUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const slug = httpRequest.params?.slug;

      if (!slug) {
        return invalidSlugResponse();
      }

      const deletedProduct = await this.deleteProductUseCase.execute(slug);

      if (!deletedProduct) {
        return notFound("Produto não encontrado.");
      }

      return ok(deletedProduct);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
