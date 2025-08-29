import { faker } from "@faker-js/faker";
import { GetCategoryBySlugRepository } from "../get-category-by-slug";
import { db } from "../../../db";
import { categories, products } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("GetCategoryBySlugRepository", () => {
  let getCategoryBySlugRepository: GetCategoryBySlugRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    getCategoryBySlugRepository = new GetCategoryBySlugRepository();
  });

  it("should get category by slug with products successfully", async () => {
    const mockCategory = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockProducts = [
      {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        slug: faker.helpers.slugify(faker.commerce.productName()),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 0, max: 100 }),
        description: faker.commerce.productDescription(),
        category_id: mockCategory.id,
        image_url: faker.image.url(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const slug = mockCategory.slug;

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([mockCategory]),
        }),
      }),
    } as any);

    const result = await getCategoryBySlugRepository.execute(slug);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(categories);
    expect(result).toEqual({
      ...mockCategory,
      products: mockProducts,
    });
  });

  it("should return null when category does not exist", async () => {
    const slug = faker.helpers.slugify(faker.commerce.department());

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    const result = await getCategoryBySlugRepository.execute(slug);

    expect(result).toBeNull();
  });
});
