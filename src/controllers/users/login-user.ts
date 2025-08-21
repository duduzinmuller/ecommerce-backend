import { ZodError } from "zod";

import { badRequest, ok, serverError, unauthorized } from "../helpers/http";
import { userNotFoundResponse } from "../helpers/user";

import { HttpRequest } from "../../types/httpRequest";
import { LoginUserUseCase } from "../../use-cases/users/login-user";
import { loginSchema } from "../../schema/user";
import { InvalidPasswordError, UserNotFoundError } from "../../error/user";

export class LoginUserController {
  constructor(private loginUserUseCase: LoginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase;
  }

  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      await loginSchema.parseAsync(params);

      const user = await this.loginUserUseCase.execute(
        params.email,
        params.password,
      );

      return ok(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.issues[0].message);
      }

      if (error instanceof InvalidPasswordError) {
        return unauthorized("Senha incorreta");
      }

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse("Usuario não encontrado");
      }

      console.error(error);
      return serverError();
    }
  }
}
