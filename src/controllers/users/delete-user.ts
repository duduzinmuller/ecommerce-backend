import { UserNotFoundError } from "../../error/user";
import { HttpRequest } from "../../interfaces/httpRequest";
import { DeleteUserUseCase } from "../../use-cases/users/delete-user";
import { ok, serverError } from "../helpers/http";
import { userNotFoundResponse } from "../helpers/user";
import { checkIfIdIsValid, invalidIdResponse } from "../helpers/validation";

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const userId = httpRequest.params?.userId;

      if (!userId) {
        return invalidIdResponse("O ID do usuário é obrigatório.");
      }

      const idIsValid = checkIfIdIsValid(userId);

      if (!idIsValid) {
        return invalidIdResponse("Este id e invalido");
      }

      const deletedUser = await this.deleteUserUseCase.execute(userId);

      console.log(deletedUser);

      return ok(deletedUser);
    } catch (error) {
      console.error(error);
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse("Usuario não encontrado");
      }
      return serverError();
    }
  }
}
