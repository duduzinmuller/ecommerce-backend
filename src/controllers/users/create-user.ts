import { ZodError } from "zod";
import { createUserSchema } from "../../schema/user";
import { HttpRequest } from "../../types/httpRequest";
import { CreateUserUseCase } from "../../use-cases/users/create-user";
import { badRequest, created, serverError } from "../helpers/http";
import { EmailAlreadyInUseError } from "../../error/user";

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      await createUserSchema.parse(params);

      const createdUser = await this.createUserUseCase.execute(params);

      return created(createdUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.issues[0]?.message);
      }
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest(error.message);
      }
      console.error(error);
      return serverError();
    }
  }
}
