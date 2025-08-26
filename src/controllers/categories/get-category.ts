import { HttpRequest } from "../../interfaces/httpRequest";
import { GetCategoryUseCase } from "../../use-cases/categories/get-category";
import { ok, serverError } from "../helpers/http";

export class GetCategoryController {
  constructor(private getCategoryUseCase: GetCategoryUseCase) {
    this.getCategoryUseCase = getCategoryUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      const getCategories = await this.getCategoryUseCase.execute(params);

      return ok(getCategories);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
