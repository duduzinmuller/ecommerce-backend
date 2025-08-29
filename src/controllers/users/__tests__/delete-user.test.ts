import { faker } from "@faker-js/faker";
import { DeleteUserController } from "../delete-user";
import { DeleteUserUseCase } from "../../../use-cases/users/delete-user";
import { UserNotFoundError } from "../../../error/user";

const mockDeleteUserUseCase = {
  execute: jest.fn(),
} as jest.Mocked<DeleteUserUseCase>;

const deleteUserController = new DeleteUserController(mockDeleteUserUseCase);

describe("DeleteUserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete user successfully", async () => {
    const mockDeletedUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      params: {
        userId: mockDeletedUser.id,
      },
    };

    mockDeleteUserUseCase.execute.mockResolvedValue(mockDeletedUser);

    const result = await deleteUserController.execute(httpRequest);

    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith(
      mockDeletedUser.id,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockDeletedUser);
  });

  it("should return bad request when userId is missing", async () => {
    const httpRequest = {
      params: {},
    };

    const result = await deleteUserController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("O ID do usuário é obrigatório.");
  });

  it("should return bad request when userId is invalid", async () => {
    const httpRequest = {
      params: {
        userId: "invalid-uuid",
      },
    };

    const result = await deleteUserController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("Este id e invalido");
  });

  it("should return user not found response", async () => {
    const httpRequest = {
      params: {
        userId: faker.string.uuid(),
      },
    };

    mockDeleteUserUseCase.execute.mockRejectedValue(
      new UserNotFoundError("Usuario não encontrado"),
    );

    const result = await deleteUserController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe("Usuario não encontrado");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        userId: faker.string.uuid(),
      },
    };

    mockDeleteUserUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await deleteUserController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
