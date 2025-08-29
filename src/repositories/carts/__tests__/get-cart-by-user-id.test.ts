import { GetCartByUserIdRepository } from "../get-cart-by-user-id";
import { faker } from "@faker-js/faker";

const mockDb = {
  select: jest.fn(),
  delete: jest.fn(),
};

const mockCart = {
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  created_at: faker.date.past(),
  updated_at: faker.date.recent(),
};

const mockCartItems = [
  {
    itemId: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    productId: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    imageUrl: faker.image.url(),
  },
  {
    itemId: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    productId: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    imageUrl: faker.image.url(),
  },
];

describe("GetCartByUserIdRepository", () => {
  let getCartByUserIdRepository: GetCartByUserIdRepository;

  beforeEach(() => {
    getCartByUserIdRepository = new GetCartByUserIdRepository();
    jest.clearAllMocks();
  });

  it("should get cart by user id successfully", async () => {
    const userId = faker.string.uuid();
    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockCart]),
    };

    const mockSelectItems = {
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(mockCartItems),
    };

    mockDb.select.mockReturnValueOnce(mockSelect);
    mockDb.select.mockReturnValueOnce(mockSelectItems);

    const result = await getCartByUserIdRepository.execute(userId);

    expect(mockDb.select).toHaveBeenCalledTimes(2);
    expect(mockSelect.from).toHaveBeenCalled();
    expect(mockSelect.where).toHaveBeenCalled();
    expect(mockSelectItems.from).toHaveBeenCalled();
    expect(mockSelectItems.innerJoin).toHaveBeenCalled();
    expect(mockSelectItems.where).toHaveBeenCalled();
    expect(result).toEqual({
      ...mockCart,
      items: mockCartItems,
    });
  });

  it("should return null when cart does not exist", async () => {
    const userId = faker.string.uuid();
    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
    };

    mockDb.select.mockReturnValue(mockSelect);

    const result = await getCartByUserIdRepository.execute(userId);

    expect(mockDb.select).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });
});
