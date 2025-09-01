import { faker } from "@faker-js/faker";
import { GetCategoryRepository } from "../get-category";
import { db } from "../../../db";
import { categories, products } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn(),
    where: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("GetCategoryRepository", () => {
  let getCategoryRepository: GetCategoryRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    getCategoryRepository = new GetCategoryRepository();
  });

  it("should get all categories with products successfully", async () => {
    const mockCategories = [
      {
        id: faker.string.uuid(),
        name: faker.commerce.department(),
        slug: faker.helpers.slugify(faker.commerce.department()),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: faker.string.uuid(),
        name: faker.commerce.department(),
        slug: faker.helpers.slugify(faker.commerce.department()),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const mockProducts = [
      {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        slug: faker.helpers.slugify(faker.commerce.productName()),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 0, max: 100 }),
        description: faker.commerce.productDescription(),
        category_id: mockCategories[0].id,
        image_url: faker.image.url(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    mockDb.select.mockReturnValue({
      from: jest.fn().mockResolvedValue(mockCategories),
    } as any);

    const result = await getCategoryRepository.execute();

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toEqual([
      {
        ...mockCategories[0],
        products: mockProducts,
      },
      {
        ...mockCategories[1],
        products: [],
      },
    ]);
  });

  it("should return empty array when no categories exist", async () => {
    mockDb.select.mockReturnValue({
      from: jest.fn().mockResolvedValue([]),
    } as any);

    const result = await getCategoryRepository.execute();

    expect(result).toEqual([]);
  });
});
