import { ClearCartRepository } from "../clear-cart";
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

describe("ClearCartRepository", () => {
  let clearCartRepository: ClearCartRepository;

  beforeEach(() => {
    clearCartRepository = new ClearCartRepository();
    jest.clearAllMocks();
  });

  it("should clear cart successfully", async () => {
    const userId = faker.string.uuid();
    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockCart]),
    };

    const mockDelete = {
      where: jest.fn().mockResolvedValue(undefined),
    };

    mockDb.select.mockReturnValue(mockSelect);
    mockDb.delete.mockReturnValue(mockDelete);

    const result = await clearCartRepository.execute(userId);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockSelect.from).toHaveBeenCalled();
    expect(mockSelect.where).toHaveBeenCalled();
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDelete.where).toHaveBeenCalled();
    expect(result).toEqual(mockCart);
  });

  it("should return undefined when cart does not exist", async () => {
    const userId = faker.string.uuid();
    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
    };

    mockDb.select.mockReturnValue(mockSelect);

    const result = await clearCartRepository.execute(userId);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.delete).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
