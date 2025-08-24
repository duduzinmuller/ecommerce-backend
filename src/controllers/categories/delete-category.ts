import { HttpRequest } from "../../interfaces/httpRequest";
import { DeleteCategoryUseCase } from "../../use-cases/categories/delete-category";
import { notFound, ok, serverError } from "../helpers/http";
import { invalidSlugResponse } from "../helpers/validation";

export class DeleteCategoryController {
  constructor(private deleteCategoryUseCase: DeleteCategoryUseCase) {
    this.deleteCategoryUseCase = deleteCategoryUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const slug = httpRequest.params?.slug;

      if (!slug) {
        return invalidSlugResponse();
      }

      const deletedCategory = await this.deleteCategoryUseCase.execute(slug);

      if (!deletedCategory) {
        return notFound("Categoria não encontrada");
      }

      return ok(deletedCategory);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
