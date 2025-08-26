import { ZodError } from "zod";
import { HttpRequest } from "../../interfaces/httpRequest";
import { updateProductSchema } from "../../schema/product";
import { UpdateProductUseCase } from "../../use-cases/products/update-product";
import { badRequest, notFound, ok, serverError } from "../helpers/http";
import { invalidSlugResponse } from "../helpers/validation";
import {
  CategoryIsNotFound,
  SlugAlreadyInCreateError,
} from "../../error/category";

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {
    this.updateProductUseCase = updateProductUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const slug = httpRequest.params?.slug;

      if (!slug) {
        return invalidSlugResponse();
      }

      const params = httpRequest.body;

      await updateProductSchema.parse(params);

      const updatedProduct = await this.updateProductUseCase.execute(
        slug,
        params,
      );

      return ok(updatedProduct);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.issues[0].message);
      }
      if (error instanceof SlugAlreadyInCreateError) {
        return badRequest(error.message);
      }
      if (error instanceof CategoryIsNotFound) {
        return notFound(error.message);
      }
      console.error(error);
      return serverError();
    }
  }
}
