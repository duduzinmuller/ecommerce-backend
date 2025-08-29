import { faker } from "@faker-js/faker";
import { GetCartByUserIdController } from "../get-cart-by-user-id";
import { GetCartByUserIdUseCase } from "../../../use-cases/carts/get-cart-by-user-id";

const mockGetCartByUserIdUseCase = {
  execute: jest.fn(),
} as jest.Mocked<GetCartByUserIdUseCase>;

const getCartByUserIdController = new GetCartByUserIdController(
  mockGetCartByUserIdUseCase,
);

describe("GetCartByUserIdController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get cart by user id successfully", async () => {
    const mockCart = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      body: {
        user_id: mockCart.userId,
      },
    };

    mockGetCartByUserIdUseCase.execute.mockResolvedValue(mockCart);

    const result = await getCartByUserIdController.execute(httpRequest);

    expect(mockGetCartByUserIdUseCase.execute).toHaveBeenCalledWith(
      mockCart.userId,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockCart);
  });

  it("should return not found when userId is missing", async () => {
    const httpRequest = {
      body: {},
    };

    const result = await getCartByUserIdController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe("ID do usuário não fornecido");
  });

  it("should return not found when cart does not exist", async () => {
    const httpRequest = {
      body: {
        user_id: faker.string.uuid(),
      },
    };

    mockGetCartByUserIdUseCase.execute.mockResolvedValue(null);

    const result = await getCartByUserIdController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe(
      "Carrinho não encontrado para este usuário",
    );
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      body: {
        user_id: faker.string.uuid(),
      },
    };

    mockGetCartByUserIdUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await getCartByUserIdController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
