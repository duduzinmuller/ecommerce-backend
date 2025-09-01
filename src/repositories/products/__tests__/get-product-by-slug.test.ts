import { faker } from "@faker-js/faker";
import { GetProductBySlugRepository } from "../get-product-by-slug";
import { db } from "../../../db";
import { products } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("GetProductBySlugRepository", () => {
  let getProductBySlugRepository: GetProductBySlugRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    getProductBySlugRepository = new GetProductBySlugRepository();
  });

  it("should get product by slug successfully", async () => {
    const mockProduct = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      slug: faker.helpers.slugify(faker.commerce.productName()),
      price: parseFloat(faker.commerce.price()),
      stock: faker.number.int({ min: 0, max: 100 }),
      description: faker.commerce.productDescription(),
      category_id: faker.string.uuid(),
      image_url: faker.image.url(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const slug = mockProduct.slug;

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([mockProduct]),
      }),
    } as any);

    const result = await getProductBySlugRepository.execute(slug);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toEqual(mockProduct);
  });

  it("should return null when product does not exist", async () => {
    const slug = faker.helpers.slugify(faker.commerce.productName());

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    } as any);

    const result = await getProductBySlugRepository.execute(slug);

    expect(result).toBeNull();
  });
});
