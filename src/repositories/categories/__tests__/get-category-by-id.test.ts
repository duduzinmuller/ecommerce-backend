import { faker } from "@faker-js/faker";
import { GetCategoryByIdRepository } from "../get-category-by-id";
import { db } from "../../../db";
import { categories } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("GetCategoryByIdRepository", () => {
  let getCategoryByIdRepository: GetCategoryByIdRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    getCategoryByIdRepository = new GetCategoryByIdRepository();
  });

  it("should get category by id successfully", async () => {
    const mockCategory = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const categoryId = mockCategory.id;

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([mockCategory]),
      }),
    } as any);

    const result = await getCategoryByIdRepository.execute(categoryId);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(categories);
    expect(result).toEqual(mockCategory);
  });

  it("should return null when category does not exist", async () => {
    const categoryId = faker.string.uuid();

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    } as any);

    const result = await getCategoryByIdRepository.execute(categoryId);

    expect(result).toBeNull();
  });
});
