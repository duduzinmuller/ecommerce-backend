import { faker } from "@faker-js/faker";
import { CreateOrderUseCase } from "../create-order";
import { IdGeneratorAdapter } from "../../../adapters/id-generator";
import { CartNotFoundError, EmptyCartError } from "../../../error/cart-item";
import { UserNotFoundError } from "../../../error/user";
import { GetCartByUserIdRepository } from "../../../repositories/carts/get-cart-by-user-id";
import { ClearCartRepository } from "../../../repositories/carts/clear-cart";
import { CreateOrderRepository } from "../../../repositories/orders/create-order";
import { CreateOrderItemsRepository } from "../../../repositories/orders/create-order-items";
import { GetUserByIdRepository } from "../../../repositories/users/get-user-by-id";

const mockGetUserByIdRepository = {
  execute: jest.fn(),
} as any;

const mockIdGeneratorAdapter = {
  execute: jest.fn(),
} as any;

const mockCreateOrderRepository = {
  execute: jest.fn(),
} as any;

const mockGetCartByUserIdRepository = {
  execute: jest.fn(),
} as any;

const mockCreateOrderItemsRepository = {
  execute: jest.fn(),
} as any;

const mockClearCartRepository = {
  execute: jest.fn(),
} as any;

const createOrderUseCase = new CreateOrderUseCase(
  mockGetUserByIdRepository,
  mockIdGeneratorAdapter,
  mockCreateOrderRepository,
  mockGetCartByUserIdRepository,
  mockCreateOrderItemsRepository,
  mockClearCartRepository,
);

describe("CreateOrderUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an order successfully", async () => {
    const mockOrder = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      status: "pending",
      total: "0.00",
    };

    const mockUser = {
      id: mockOrder.user_id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "hashed_password_123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockCart = {
      id: faker.string.uuid(),
      user_id: mockOrder.user_id,
      items: [
        {
          productId: faker.string.uuid(),
          price: "10.00",
          quantity: 2,
        },
        {
          productId: faker.string.uuid(),
          price: "15.50",
          quantity: 1,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockCreatedOrder = {
      ...mockOrder,
      total: "35.50",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockIdGeneratorAdapter.execute.mockResolvedValue(mockOrder.id);
    mockGetUserByIdRepository.execute.mockResolvedValue(mockUser);
    mockGetCartByUserIdRepository.execute.mockResolvedValue(mockCart);
    mockCreateOrderRepository.execute.mockResolvedValue(mockCreatedOrder);
    mockCreateOrderItemsRepository.execute.mockResolvedValue(undefined);
    mockClearCartRepository.execute.mockResolvedValue(undefined);

    const result = await createOrderUseCase.execute(mockOrder as any);

    expect(mockIdGeneratorAdapter.execute).toHaveBeenCalled();
    expect(mockGetUserByIdRepository.execute).toHaveBeenCalledWith(
      mockOrder.user_id,
    );
    expect(mockGetCartByUserIdRepository.execute).toHaveBeenCalledWith(
      mockOrder.user_id,
    );
    expect(mockCreateOrderRepository.execute).toHaveBeenCalledWith({
      id: mockOrder.id,
      user_id: mockOrder.user_id,
      status: mockOrder.status,
      total: "35.50",
    });
    expect(mockCreateOrderItemsRepository.execute).toHaveBeenCalledWith([
      {
        order_id: mockOrder.id,
        product_id: mockCart.items[0].productId,
        quantity: mockCart.items[0].quantity,
        unit_price: mockCart.items[0].price,
      },
      {
        order_id: mockOrder.id,
        product_id: mockCart.items[1].productId,
        quantity: mockCart.items[1].quantity,
        unit_price: mockCart.items[1].price,
      },
    ]);
    expect(mockClearCartRepository.execute).toHaveBeenCalledWith(
      mockOrder.user_id,
    );
    expect(result).toEqual(mockCreatedOrder);
  });

  it("should throw UserNotFoundError when user does not exist", async () => {
    const mockOrder = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      status: "pending",
      total: "0.00",
    };

    mockIdGeneratorAdapter.execute.mockResolvedValue(mockOrder.id);
    mockGetUserByIdRepository.execute.mockResolvedValue(null);

    await expect(createOrderUseCase.execute(mockOrder as any)).rejects.toThrow(
      UserNotFoundError,
    );

    expect(mockGetCartByUserIdRepository.execute).not.toHaveBeenCalled();
    expect(mockCreateOrderRepository.execute).not.toHaveBeenCalled();
  });

  it("should throw CartNotFoundError when cart does not exist", async () => {
    const mockOrder = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      status: "pending",
      total: "0.00",
    };

    const mockUser = {
      id: mockOrder.user_id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "hashed_password_123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockIdGeneratorAdapter.execute.mockResolvedValue(mockOrder.id);
    mockGetUserByIdRepository.execute.mockResolvedValue(mockUser);
    mockGetCartByUserIdRepository.execute.mockResolvedValue(null);

    await expect(createOrderUseCase.execute(mockOrder as any)).rejects.toThrow(
      CartNotFoundError,
    );

    expect(mockCreateOrderRepository.execute).not.toHaveBeenCalled();
  });

  it("should throw EmptyCartError when cart is empty", async () => {
    const mockOrder = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      status: "pending",
      total: "0.00",
    };

    const mockUser = {
      id: mockOrder.user_id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "hashed_password_123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockCart = {
      id: faker.string.uuid(),
      user_id: mockOrder.user_id,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockIdGeneratorAdapter.execute.mockResolvedValue(mockOrder.id);
    mockGetUserByIdRepository.execute.mockResolvedValue(mockUser);
    mockGetCartByUserIdRepository.execute.mockResolvedValue(mockCart);

    await expect(createOrderUseCase.execute(mockOrder as any)).rejects.toThrow(
      EmptyCartError,
    );

    expect(mockCreateOrderRepository.execute).not.toHaveBeenCalled();
  });
});
