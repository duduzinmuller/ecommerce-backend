import { faker } from "@faker-js/faker";
import { GetUserByIdController } from "../get-user-by-id";
import { GetUserByIdUseCase } from "../../../use-cases/users/get-user-by-id";

const mockGetUserByIdUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetUserByIdUseCase>;

const getUserByIdController = new GetUserByIdController(mockGetUserByIdUseCase);

describe("GetUserByIdController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get user by id successfully", async () => {
    const mockUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      params: {
        userId: mockUser.id,
      },
    };

    mockGetUserByIdUseCase.execute.mockResolvedValue(mockUser as any);

    const result = await getUserByIdController.execute(httpRequest);

    expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith(mockUser.id);
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockUser);
  });

  it("should return bad request when userId is missing", async () => {
    const httpRequest = {
      params: {},
    };

    const result = await getUserByIdController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("O ID do usuário é obrigatório.");
  });

  it("should return bad request when userId is invalid", async () => {
    const httpRequest = {
      params: {
        userId: "invalid-uuid",
      },
    };

    const result = await getUserByIdController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("Este ID é inválido.");
  });

  it("should return not found when user does not exist", async () => {
    const httpRequest = {
      params: {
        userId: faker.string.uuid(),
      },
    };

    mockGetUserByIdUseCase.execute.mockResolvedValue([]);

    const result = await getUserByIdController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body).toBe("Usuário não encontrado");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        userId: faker.string.uuid(),
      },
    };

    mockGetUserByIdUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await getUserByIdController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
