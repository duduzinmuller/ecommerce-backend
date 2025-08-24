import { HttpRequest } from "../../interfaces/httpRequest";
import { GetUserByIdUseCase } from "../../use-cases/users/get-user-by-id";
import { badRequest, notFound, ok, serverError } from "../helpers/http";
import { checkIfIdIsValid, invalidIdResponse } from "../helpers/validation";

export class GetUserByIdController {
  constructor(private getUserByIdUseCase: GetUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const userId = httpRequest.params?.userId;

      if (!userId) {
        return invalidIdResponse("O ID do usuário é obrigatório.");
      }

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse("Este ID é inválido.");
      }

      const user = await this.getUserByIdUseCase.execute(userId);

      if (!user) {
        return notFound("Usuário não encontrado");
      }

      return ok(user);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
