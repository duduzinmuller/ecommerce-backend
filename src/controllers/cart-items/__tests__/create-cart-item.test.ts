import { faker } from "@faker-js/faker";
import { CreateCartItemController } from "../create-cart-item";
import { CreateCartItemUseCase } from "../../../use-cases/cart-items/create-cart-item";
import {
  IdCartAndProductId,
  QuantityProductError,
} from "../../../error/cart-item";

const mockCreateCartItemUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<CreateCartItemUseCase>;

const createCartItemController = new CreateCartItemController(
  mockCreateCartItemUseCase,
);

describe("CreateCartItemController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a cart item successfully", async () => {
    const mockCartItem = {
      id: faker.string.uuid(),
      cartId: faker.string.uuid(),
      productId: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      body: {
        cartId: mockCartItem.cartId,
        productId: mockCartItem.productId,
        quantity: mockCartItem.quantity,
      },
    };

    mockCreateCartItemUseCase.execute.mockResolvedValue(mockCartItem as any);

    const result = await createCartItemController.execute(httpRequest);

    expect(mockCreateCartItemUseCase.execute).toHaveBeenCalledWith(
      httpRequest.body,
    );
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(mockCartItem);
  });

  it("should return bad request for validation error", async () => {
    const httpRequest = {
      body: {
        cartId: "",
        productId: "",
        quantity: 0,
      },
    };

    const result = await createCartItemController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("message");
  });

  it("should return bad request for cart and product id error", async () => {
    const httpRequest = {
      body: {
        cartId: faker.string.uuid(),
        productId: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
      },
    };

    mockCreateCartItemUseCase.execute.mockRejectedValue(
      new IdCartAndProductId(),
    );

    const result = await createCartItemController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("Carrinho ou produto não encontrado");
  });

  it("should return bad request for quantity error", async () => {
    const httpRequest = {
      body: {
        cartId: faker.string.uuid(),
        productId: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
      },
    };

    mockCreateCartItemUseCase.execute.mockRejectedValue(
      new QuantityProductError(),
    );

    const result = await createCartItemController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("Quantidade inválida");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      body: {
        cartId: faker.string.uuid(),
        productId: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
      },
    };

    mockCreateCartItemUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await createCartItemController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
