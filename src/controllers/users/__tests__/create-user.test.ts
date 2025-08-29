import { faker } from "@faker-js/faker";
import { CreateUserController } from "../create-user";
import { CreateUserUseCase } from "../../../use-cases/users/create-user";
import { EmailAlreadyInUseError } from "../../../error/user";
import { ZodError } from "zod";

const mockCreateUserUseCase = {
  execute: jest.fn(),
} as jest.Mocked<CreateUserUseCase>;

const createUserController = new CreateUserController(mockCreateUserUseCase);

describe("CreateUserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user successfully", async () => {
    const mockUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      body: {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      },
    };

    mockCreateUserUseCase.execute.mockResolvedValue(mockUser);

    const result = await createUserController.execute(httpRequest);

    expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(
      httpRequest.body,
    );
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(mockUser);
  });

  it("should return bad request for validation error", async () => {
    const httpRequest = {
      body: {
        name: "",
        email: "invalid-email",
        password: "123",
      },
    };

    const result = await createUserController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("message");
  });

  it("should return bad request for email already in use", async () => {
    const httpRequest = {
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    mockCreateUserUseCase.execute.mockRejectedValue(
      new EmailAlreadyInUseError("Email já está em uso"),
    );

    const result = await createUserController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("Email já está em uso");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    mockCreateUserUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await createUserController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
