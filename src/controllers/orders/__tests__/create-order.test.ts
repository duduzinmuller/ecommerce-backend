import { faker } from "@faker-js/faker";
import { CreateOrderController } from "../create-order";
import { CreateOrderUseCase } from "../../../use-cases/orders/create-order";
import {
  UserNotFoundError,
  CartNotFoundError,
  EmptyCartError,
} from "../../../error/user";

const mockCreateOrderUseCase = {
  execute: jest.fn(),
} as jest.Mocked<CreateOrderUseCase>;

const createOrderController = new CreateOrderController(mockCreateOrderUseCase);

describe("CreateOrderController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an order successfully", async () => {
    const mockOrder = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      status: "pending",
      total: parseFloat(faker.commerce.price()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      body: {
        userId: mockOrder.userId,
        status: mockOrder.status,
        total: mockOrder.total,
      },
    };

    mockCreateOrderUseCase.execute.mockResolvedValue(mockOrder);

    const result = await createOrderController.execute(httpRequest);

    expect(mockCreateOrderUseCase.execute).toHaveBeenCalledWith(
      httpRequest.body,
    );
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(mockOrder);
  });

  it("should return bad request for validation error", async () => {
    const httpRequest = {
      body: {
        userId: "",
        status: "",
        total: -10,
      },
    };

    const result = await createOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("message");
  });

  it("should return not found for user not found", async () => {
    const httpRequest = {
      body: {
        userId: faker.string.uuid(),
        status: "pending",
        total: parseFloat(faker.commerce.price()),
      },
    };

    mockCreateOrderUseCase.execute.mockRejectedValue(
      new UserNotFoundError("Usuário não encontrado"),
    );

    const result = await createOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe("Usuário não encontrado");
  });

  it("should return bad request for cart not found", async () => {
    const httpRequest = {
      body: {
        userId: faker.string.uuid(),
        status: "pending",
        total: parseFloat(faker.commerce.price()),
      },
    };

    mockCreateOrderUseCase.execute.mockRejectedValue(
      new CartNotFoundError("Carrinho não encontrado"),
    );

    const result = await createOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("Carrinho não encontrado");
  });

  it("should return bad request for empty cart", async () => {
    const httpRequest = {
      body: {
        userId: faker.string.uuid(),
        status: "pending",
        total: parseFloat(faker.commerce.price()),
      },
    };

    mockCreateOrderUseCase.execute.mockRejectedValue(
      new EmptyCartError("Carrinho está vazio"),
    );

    const result = await createOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("Carrinho está vazio");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      body: {
        userId: faker.string.uuid(),
        status: "pending",
        total: parseFloat(faker.commerce.price()),
      },
    };

    mockCreateOrderUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await createOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
