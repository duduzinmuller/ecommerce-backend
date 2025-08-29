import { faker } from "@faker-js/faker";
import { CreateCategoryRepository } from "../create-category";
import { db } from "../../../db";
import { categories } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("CreateCategoryRepository", () => {
  let createCategoryRepository: CreateCategoryRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    createCategoryRepository = new CreateCategoryRepository();
  });

  it("should create a category successfully", async () => {
    const mockCategory = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
    };

    const mockCreatedCategory = [mockCategory];

    mockDb.insert.mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue(mockCreatedCategory),
      }),
    } as any);

    const result = await createCategoryRepository.execute(mockCategory);

    expect(mockDb.insert).toHaveBeenCalledWith(categories);
    expect(result).toEqual(mockCreatedCategory);
  });
});
