import { faker } from "@faker-js/faker";
import { CreateCartController } from "../create-cart";
import { CreateCartUseCase } from "../../../use-cases/carts/create-cart";
import { UserNotFoundError } from "../../../error/user";

const mockCreateCartUseCase = {
  execute: jest.fn(),
} as jest.Mocked<CreateCartUseCase>;

const createCartController = new CreateCartController(mockCreateCartUseCase);

describe("CreateCartController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a cart successfully", async () => {
    const mockCart = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      body: {
        userId: mockCart.userId,
      },
    };

    mockCreateCartUseCase.execute.mockResolvedValue(mockCart);

    const result = await createCartController.execute(httpRequest);

    expect(mockCreateCartUseCase.execute).toHaveBeenCalledWith(
      httpRequest.body,
    );
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(mockCart);
  });

  it("should return bad request for validation error", async () => {
    const httpRequest = {
      body: {
        userId: "",
      },
    };

    const result = await createCartController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("message");
  });

  it("should return user not found response", async () => {
    const httpRequest = {
      body: {
        userId: faker.string.uuid(),
      },
    };

    mockCreateCartUseCase.execute.mockRejectedValue(
      new UserNotFoundError("Usuário não encontrado"),
    );

    const result = await createCartController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe("Usuário não encontrado");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      body: {
        userId: faker.string.uuid(),
      },
    };

    mockCreateCartUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await createCartController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
