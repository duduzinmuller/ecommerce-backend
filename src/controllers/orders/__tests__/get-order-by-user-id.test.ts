import { faker } from "@faker-js/faker";
import { GetOrderByUserIdController } from "../get-order-by-user-id";
import { GetOrderByUserIdUseCase } from "../../../use-cases/orders/get-order-by-user-id";

const mockGetOrderByUserIdUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetOrderByUserIdUseCase>;

const getOrderByUserIdController = new GetOrderByUserIdController(
  mockGetOrderByUserIdUseCase,
);

describe("GetOrderByUserIdController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get order by user id successfully", async () => {
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
        user_id: mockOrder.userId,
      },
    };

    mockGetOrderByUserIdUseCase.execute.mockResolvedValue(mockOrder as any);

    const result = await getOrderByUserIdController.execute(httpRequest);

    expect(mockGetOrderByUserIdUseCase.execute).toHaveBeenCalledWith(
      mockOrder.userId,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockOrder);
  });

  it("should return bad request when userId is missing", async () => {
    const httpRequest = {
      body: {},
    };

    const result = await getOrderByUserIdController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("ID do usuário não fornecido");
  });

  it("should return not found when order does not exist", async () => {
    const httpRequest = {
      body: {
        user_id: faker.string.uuid(),
      },
    };

    mockGetOrderByUserIdUseCase.execute.mockResolvedValue(null);

    const result = await getOrderByUserIdController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body).toBe("Pedido não encontrado para este usuário");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      body: {
        user_id: faker.string.uuid(),
      },
    };

    mockGetOrderByUserIdUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await getOrderByUserIdController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
