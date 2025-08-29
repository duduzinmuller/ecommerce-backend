import { faker } from "@faker-js/faker";
import { GetProductByNameRepository } from "../get-product-by-name";
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

describe("GetProductByNameRepository", () => {
  let getProductByNameRepository: GetProductByNameRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    getProductByNameRepository = new GetProductByNameRepository();
  });

  it("should get product by name successfully", async () => {
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

    const productName = mockProduct.name;

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([mockProduct]),
      }),
    } as any);

    const result = await getProductByNameRepository.execute(productName);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(products);
    expect(result).toEqual(mockProduct);
  });

  it("should return null when product does not exist", async () => {
    const productName = faker.commerce.productName();

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    } as any);

    const result = await getProductByNameRepository.execute(productName);

    expect(result).toBeNull();
  });
});
