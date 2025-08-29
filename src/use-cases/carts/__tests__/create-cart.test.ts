import { faker } from "@faker-js/faker";
import { CreateCartUseCase } from "../create-cart";
import { IdGeneratorAdapter } from "../../../adapters/id-generator";
import { UserNotFoundError } from "../../../error/user";
import { CreateCartRepository } from "../../../repositories/carts/create-cart";
import { GetUserByIdRepository } from "../../../repositories/users/get-user-by-id";

const mockIdGeneratorAdapter = {
  execute: jest.fn(),
} as jest.Mocked<IdGeneratorAdapter>;

const mockGetUserByIdRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetUserByIdRepository>;

const mockCreateCartRepository = {
  execute: jest.fn(),
} as jest.Mocked<CreateCartRepository>;

const createCartUseCase = new CreateCartUseCase(
  mockIdGeneratorAdapter,
  mockGetUserByIdRepository,
  mockCreateCartRepository,
);

describe("CreateCartUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a cart successfully", async () => {
    const mockCart = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
    };

    const mockUser = {
      id: mockCart.user_id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "hashed_password_123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockIdGeneratorAdapter.execute.mockResolvedValue(mockCart.id);
    mockGetUserByIdRepository.execute.mockResolvedValue(mockUser);
    mockCreateCartRepository.execute.mockResolvedValue({
      ...mockCart,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createCartUseCase.execute(mockCart);

    expect(mockIdGeneratorAdapter.execute).toHaveBeenCalled();
    expect(mockGetUserByIdRepository.execute).toHaveBeenCalledWith(
      mockCart.user_id,
    );
    expect(mockCreateCartRepository.execute).toHaveBeenCalledWith({
      id: mockCart.id,
      user_id: mockCart.user_id,
    });
    expect(result).toHaveProperty("id", mockCart.id);
  });

  it("should throw UserNotFoundError when user does not exist", async () => {
    const mockCart = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
    };

    mockIdGeneratorAdapter.execute.mockResolvedValue(mockCart.id);
    mockGetUserByIdRepository.execute.mockResolvedValue(null);

    await expect(createCartUseCase.execute(mockCart)).rejects.toThrow(
      UserNotFoundError,
    );

    expect(mockIdGeneratorAdapter.execute).toHaveBeenCalled();
    expect(mockGetUserByIdRepository.execute).toHaveBeenCalledWith(
      mockCart.user_id,
    );
    expect(mockCreateCartRepository.execute).not.toHaveBeenCalled();
  });
});
