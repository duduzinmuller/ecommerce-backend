import { ZodError } from "zod";
import { HttpRequest } from "../../interfaces/httpRequest";
import { CreateProductUseCase } from "../../use-cases/products/create-product";
import { badRequest, created, notFound, serverError } from "../helpers/http";
import {
  CategoryIsNotFound,
  SlugAlreadyInCreateError,
} from "../../error/category";
import { createProductSchema } from "../../schema/product";

export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {
    this.createProductUseCase = createProductUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      await createProductSchema.parse(params);

      const createdProduct = await this.createProductUseCase.execute(params);

      return created(createdProduct);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        return badRequest(error.issues[0]?.message);
      }
      if (error instanceof CategoryIsNotFound) {
        return notFound(error.message);
      }
      if (error instanceof SlugAlreadyInCreateError) {
        return badRequest(error.message);
      }
      return serverError();
    }
  }
}
