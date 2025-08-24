import { ZodError } from "zod";
import { HttpRequest } from "../../interfaces/httpRequest";
import { badRequest, created, serverError } from "../helpers/http";
import { createCategorySchema } from "../../schema/category";
import { CreateCategoryUseCase } from "../../use-cases/categories/create-category";
import { SlugAlreadyInCreateError } from "../../error/category";

export class CreateCategoryController {
  constructor(private createCategoryUseCase: CreateCategoryUseCase) {
    this.createCategoryUseCase = createCategoryUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      await createCategorySchema.parse(params);

      const createdCategory = await this.createCategoryUseCase.execute(params);

      return created(createdCategory);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        return badRequest(error.issues[0].message);
      }
      if (error instanceof SlugAlreadyInCreateError) {
        return badRequest(error.message);
      }
      return serverError();
    }
  }
}
