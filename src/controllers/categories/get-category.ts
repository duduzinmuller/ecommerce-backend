import { HttpRequest } from "../../interfaces/httpRequest";
import { GetCategoryUseCase } from "../../use-cases/categories/get-category";
import { ok, serverError } from "../helpers/http";

export class GetCategoryController {
  constructor(private getCategoryRepository: GetCategoryUseCase) {
    this.getCategoryRepository = getCategoryRepository;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const getCategories = await this.getCategoryRepository.execute();

      return ok(getCategories);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
