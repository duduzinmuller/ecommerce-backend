import { HttpRequest } from "../../types/httpRequest";
import { GetCategoryBySlugUseCase } from "../../use-cases/categories/get-category-by-slug";
import { notFound, ok, serverError } from "../helpers/http";
import { invalidSlugResponse } from "../helpers/validation";

export class GetCategoryBySlugController {
  constructor(private getCategoryBySlugUseCase: GetCategoryBySlugUseCase) {
    this.getCategoryBySlugUseCase = getCategoryBySlugUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const slug = httpRequest.params?.slug;

      if (!slug) {
        return invalidSlugResponse();
      }

      const getCategorySlug = await this.getCategoryBySlugUseCase.execute(slug);

      if (!getCategorySlug) {
        return notFound("Categoria não encontrada");
      }

      return ok(getCategorySlug);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
