import { faker } from "@faker-js/faker";
import { CreateProductRepository } from "../create-product";
import { db } from "../../../db";
import { products } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("CreateProductRepository", () => {
  let createProductRepository: CreateProductRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    createProductRepository = new CreateProductRepository();
  });

  it("should create a product successfully", async () => {
    const mockProduct = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      slug: faker.helpers.slugify(faker.commerce.productName()),
      price: parseFloat(faker.commerce.price()),
      stock: faker.number.int({ min: 0, max: 100 }),
      description: faker.commerce.productDescription(),
      category_id: faker.string.uuid(),
      image_url: faker.image.url(),
    };

    const mockCreatedProduct = [mockProduct];

    mockDb.insert.mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue(mockCreatedProduct),
      }),
    } as any);

    const result = await createProductRepository.execute(mockProduct);

    expect(mockDb.insert).toHaveBeenCalledWith(products);
    expect(result).toEqual(mockCreatedProduct);
  });
});
