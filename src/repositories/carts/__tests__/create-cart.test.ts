import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { CreateCartRepository } from "../create-cart";
import { faker } from "@faker-js/faker";

const mockDb = {
  insert: jest.fn(),
};

const mockCart = {
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};

describe("CreateCartRepository", () => {
  let createCartRepository: CreateCartRepository;

  beforeEach(() => {
    createCartRepository = new CreateCartRepository(mockDb as any);
    jest.clearAllMocks();
  });

  it("should create a cart successfully", async () => {
    const mockInsert = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockCart]),
    };

    mockDb.insert.mockReturnValue(mockInsert);

    const result = await createCartRepository.create(mockCart.userId);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockInsert.values).toHaveBeenCalledWith({
      id: expect.any(String),
      userId: mockCart.userId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(mockInsert.returning).toHaveBeenCalled();
    expect(result).toEqual(mockCart);
  });
});
