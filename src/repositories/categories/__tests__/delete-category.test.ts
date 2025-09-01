import { faker } from "@faker-js/faker";
import { DeleteCategoryRepository } from "../delete-category";
import { db } from "../../../db";
import { categories } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn(),
    delete: jest.fn().mockReturnThis(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("DeleteCategoryRepository", () => {
  let deleteCategoryRepository: DeleteCategoryRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    deleteCategoryRepository = new DeleteCategoryRepository();
  });

  it("should delete a category successfully", async () => {
    const mockCategory = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const slug = mockCategory.slug;

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([mockCategory]),
      }),
    } as any);

    mockDb.delete.mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    } as any);

    const result = await deleteCategoryRepository.execute(slug);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.delete).toHaveBeenCalledWith(categories);
    expect(result).toEqual(mockCategory);
  });

  it("should return undefined when category does not exist", async () => {
    const slug = faker.helpers.slugify(faker.commerce.department());

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    } as any);

    mockDb.delete.mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    } as any);

    const result = await deleteCategoryRepository.execute(slug);

    expect(result).toBeUndefined();
  });
});
