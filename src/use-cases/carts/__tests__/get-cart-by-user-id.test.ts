import { faker } from "@faker-js/faker";
import { GetCartByUserIdUseCase } from "../get-cart-by-user-id";
import { GetCartByUserIdRepository } from "../../../repositories/carts/get-cart-by-user-id";

const mockGetCartByUserIdRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetCartByUserIdRepository>;

const getCartByUserIdUseCase = new GetCartByUserIdUseCase(
  mockGetCartByUserIdRepository,
);

describe("GetCartByUserIdUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get cart by user id successfully", async () => {
    const mockCart = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userId = mockCart.user_id;

    mockGetCartByUserIdRepository.execute.mockResolvedValue(mockCart);

    const result = await getCartByUserIdUseCase.execute(userId);

    expect(mockGetCartByUserIdRepository.execute).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockCart);
  });

  it("should return null when cart does not exist", async () => {
    const userId = faker.string.uuid();

    mockGetCartByUserIdRepository.execute.mockResolvedValue(null);

    const result = await getCartByUserIdUseCase.execute(userId);

    expect(mockGetCartByUserIdRepository.execute).toHaveBeenCalledWith(userId);
    expect(result).toBeNull();
  });
});
