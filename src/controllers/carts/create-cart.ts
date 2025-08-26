import { ZodError } from "zod";
import { HttpRequest } from "../../interfaces/httpRequest";
import { CreateCartUseCase } from "../../use-cases/carts/create-cart";
import { badRequest, created, serverError } from "../helpers/http";
import { UserNotFoundError } from "../../error/user";
import { userNotFoundResponse } from "../helpers/user";
import { createCartSchema } from "../../schema/cart";

export class CreateCartController {
  constructor(private createCartUseCase: CreateCartUseCase) {
    this.createCartUseCase = createCartUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      await createCartSchema.parse(params);

      const createdCart = await this.createCartUseCase.execute(params);

      return created(createdCart);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.issues[0]?.message);
      }
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse(error.message);
      }
      console.error(error);
      return serverError();
    }
  }
}
