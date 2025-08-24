import { HttpRequest } from "../../interfaces/httpRequest";
import { GetCategoryByIdUseCase } from "../../use-cases/categories/get-category-by-id";
import { notFound, ok, serverError } from "../helpers/http";
import { invalidIdResponse } from "../helpers/validation";

export class GetCategoryByIdController {
  constructor(private getCategoryByIdUseCase: GetCategoryByIdUseCase) {
    this.getCategoryByIdUseCase = getCategoryByIdUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const categoryId = httpRequest.params?.categoryId;

      if (!categoryId) {
        return invalidIdResponse("Este ID é invalído.");
      }

      const getCategoryById =
        await this.getCategoryByIdUseCase.execute(categoryId);

      if (!getCategoryById) {
        return notFound("Categoria não encontrada.");
      }

      return ok(getCategoryById);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
