import { faker } from "@faker-js/faker";
import { GetOrderByUserIdUseCase } from "../get-order-by-user-id";
import { GetOrderByUserIdRepository } from "../../../repositories/orders/get-order-by-user-id";

const mockGetOrderByUserIdRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetOrderByUserIdRepository>;

const getOrderByUserIdUseCase = new GetOrderByUserIdUseCase(
  mockGetOrderByUserIdRepository,
);

describe("GetOrderByUserIdUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get order by user id successfully", async () => {
    const mockOrder = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      status: "pending",
      total: "35.50",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userId = mockOrder.user_id;

    mockGetOrderByUserIdRepository.execute.mockResolvedValue(mockOrder as any);

    const result = await getOrderByUserIdUseCase.execute(userId);

    expect(mockGetOrderByUserIdRepository.execute).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockOrder);
  });

  it("should return null when order does not exist", async () => {
    const userId = faker.string.uuid();

    mockGetOrderByUserIdRepository.execute.mockResolvedValue(null);

    const result = await getOrderByUserIdUseCase.execute(userId);

    expect(mockGetOrderByUserIdRepository.execute).toHaveBeenCalledWith(userId);
    expect(result).toBeNull();
  });
});
