import { faker } from "@faker-js/faker";
import { CreateCartItemUseCase } from "../create-cart-item";
import { CreateCartItemRepository } from "../../../repositories/cart-items/create-cart-item";
import { IdGeneratorAdapter } from "../../../adapters/id-generator";
import {
  IdCartAndProductId,
  QuantityProductError,
} from "../../../error/cart-item";

const mockCreateCartItemRepository = {
  execute: jest.fn(),
} as jest.Mocked<CreateCartItemRepository>;

const mockIdGeneratorAdapter = {
  execute: jest.fn(),
} as jest.Mocked<IdGeneratorAdapter>;

const createCartItemUseCase = new CreateCartItemUseCase(
  mockCreateCartItemRepository,
  mockIdGeneratorAdapter,
);

describe("CreateCartItemUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a cart item successfully", async () => {
    const mockCartItem = {
      id: faker.string.uuid(),
      cart_id: faker.string.uuid(),
      product_id: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 10 }),
    };

    mockIdGeneratorAdapter.execute.mockResolvedValue(mockCartItem.id);
    mockCreateCartItemRepository.execute.mockResolvedValue({
      ...mockCartItem,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createCartItemUseCase.execute(mockCartItem);

    expect(mockIdGeneratorAdapter.execute).toHaveBeenCalled();
    expect(mockCreateCartItemRepository.execute).toHaveBeenCalledWith({
      id: mockCartItem.id,
      cart_id: mockCartItem.cart_id,
      product_id: mockCartItem.product_id,
      quantity: mockCartItem.quantity,
    });
    expect(result).toHaveProperty("id", mockCartItem.id);
  });

  it("should throw IdCartAndProductId when cart_id is missing", async () => {
    const mockCartItem = {
      id: faker.string.uuid(),
      product_id: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 10 }),
    };

    await expect(createCartItemUseCase.execute(mockCartItem)).rejects.toThrow(
      IdCartAndProductId,
    );

    expect(mockCreateCartItemRepository.execute).not.toHaveBeenCalled();
  });

  it("should throw IdCartAndProductId when product_id is missing", async () => {
    const mockCartItem = {
      id: faker.string.uuid(),
      cart_id: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 10 }),
    };

    await expect(createCartItemUseCase.execute(mockCartItem)).rejects.toThrow(
      IdCartAndProductId,
    );

    expect(mockCreateCartItemRepository.execute).not.toHaveBeenCalled();
  });

  it("should throw QuantityProductError when quantity is invalid", async () => {
    const mockCartItem = {
      id: faker.string.uuid(),
      cart_id: faker.string.uuid(),
      product_id: faker.string.uuid(),
      quantity: 0,
    };

    await expect(createCartItemUseCase.execute(mockCartItem)).rejects.toThrow(
      QuantityProductError,
    );

    expect(mockCreateCartItemRepository.execute).not.toHaveBeenCalled();
  });

  it("should throw QuantityProductError when quantity is negative", async () => {
    const mockCartItem = {
      id: faker.string.uuid(),
      cart_id: faker.string.uuid(),
      product_id: faker.string.uuid(),
      quantity: -5,
    };

    await expect(createCartItemUseCase.execute(mockCartItem)).rejects.toThrow(
      QuantityProductError,
    );

    expect(mockCreateCartItemRepository.execute).not.toHaveBeenCalled();
  });
});
