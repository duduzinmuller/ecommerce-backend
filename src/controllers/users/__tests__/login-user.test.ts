import { faker } from "@faker-js/faker";
import { LoginUserController } from "../login-user";
import { LoginUserUseCase } from "../../../use-cases/users/login-user";
import { InvalidPasswordError, UserNotFoundError } from "../../../error/user";

const mockLoginUserUseCase = {
  execute: jest.fn(),
} as jest.Mocked<LoginUserUseCase>;

const loginUserController = new LoginUserController(mockLoginUserUseCase);

describe("LoginUserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login user successfully", async () => {
    const mockUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      token: faker.string.alphanumeric(32),
    };

    const httpRequest = {
      body: {
        email: mockUser.email,
        password: faker.internet.password(),
      },
    };

    mockLoginUserUseCase.execute.mockResolvedValue(mockUser);

    const result = await loginUserController.execute(httpRequest);

    expect(mockLoginUserUseCase.execute).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.password,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockUser);
  });

  it("should return bad request for validation error", async () => {
    const httpRequest = {
      body: {
        email: "invalid-email",
        password: "",
      },
    };

    const result = await loginUserController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("message");
  });

  it("should return unauthorized for invalid password", async () => {
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    mockLoginUserUseCase.execute.mockRejectedValue(
      new InvalidPasswordError("Senha incorreta"),
    );

    const result = await loginUserController.execute(httpRequest);

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe("Senha incorreta");
  });

  it("should return user not found response", async () => {
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    mockLoginUserUseCase.execute.mockRejectedValue(
      new UserNotFoundError("Usuario não encontrado"),
    );

    const result = await loginUserController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe("Usuario não encontrado");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    mockLoginUserUseCase.execute.mockRejectedValue(new Error("Database error"));

    const result = await loginUserController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
