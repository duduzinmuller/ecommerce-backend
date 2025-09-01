import { faker } from "@faker-js/faker";
import { DeleteProductRepository } from "../delete-product";
import { db } from "../../../db";
import { products } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn(),
    delete: jest.fn().mockReturnThis(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("DeleteProductRepository", () => {
  let deleteProductRepository: DeleteProductRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    deleteProductRepository = new DeleteProductRepository();
  });

  it("should delete a product successfully", async () => {
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

    mockDb.delete.mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    } as any);

    const result = await deleteProductRepository.execute(slug);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.delete).toHaveBeenCalledWith(products);
    expect(result).toEqual(mockProduct);
  });

  it("should return undefined when product does not exist", async () => {
    const slug = faker.helpers.slugify(faker.commerce.productName());

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    } as any);

    mockDb.delete.mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    } as any);

    const result = await deleteProductRepository.execute(slug);

    expect(result).toBeUndefined();
  });
});
