import { HttpRequest } from "../../types/httpRequest";
import { DeleteUserUseCase } from "../../use-cases/users/delete-user";
import { notFound, ok, serverError } from "../helpers/http";
import { invalidIdResponse } from "../helpers/validation";

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const userId = httpRequest.params?.userId;

      if (!userId) {
        return invalidIdResponse("Este ID e inválido");
      }

      const deletedUser = await this.deleteUserUseCase.execute(userId);

      if (!deletedUser) {
        return notFound("Usuario não encontrado");
      }

      return ok(deletedUser);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
