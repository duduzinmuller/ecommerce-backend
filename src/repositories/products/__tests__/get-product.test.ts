import { faker } from "@faker-js/faker";
import { GetProductRepository } from "../get-product";
import { db } from "../../../db";
import { products } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("GetProductRepository", () => {
  let getProductRepository: GetProductRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    getProductRepository = new GetProductRepository();
  });

  it("should get all products successfully", async () => {
    const mockProducts = [
      {
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
      },
      {
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
      },
    ];

    mockDb.select.mockReturnValue({
      from: jest.fn().mockResolvedValue(mockProducts),
    } as any);

    const result = await getProductRepository.execute();

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toEqual(mockProducts);
  });

  it("should return empty array when no products exist", async () => {
    mockDb.select.mockReturnValue({
      from: jest.fn().mockResolvedValue([]),
    } as any);

    const result = await getProductRepository.execute();

    expect(result).toEqual([]);
  });
});
