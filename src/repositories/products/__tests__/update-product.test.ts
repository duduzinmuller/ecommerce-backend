import { faker } from "@faker-js/faker";
import { UpdateProductRepository } from "../update-product";
import { db } from "../../../db";
import { products } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("UpdateProductRepository", () => {
  let updateProductRepository: UpdateProductRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    updateProductRepository = new UpdateProductRepository();
  });

  it("should update a product successfully", async () => {
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
    const updateParams = {
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
    };

    const mockUpdatedProduct = [
      {
        ...mockProduct,
        ...updateParams,
      },
    ];

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([mockProduct]),
        }),
      }),
    } as any);

    mockDb.update.mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue(mockUpdatedProduct),
        }),
      }),
    } as any);

    const result = await updateProductRepository.execute(slug, updateParams);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(products);
    expect(mockDb.update).toHaveBeenCalledWith(products);
    expect(result).toEqual(mockUpdatedProduct[0]);
  });

  it("should throw error when product does not exist", async () => {
    const slug = faker.helpers.slugify(faker.commerce.productName());
    const updateParams = {
      name: faker.commerce.productName(),
    };

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    await expect(
      updateProductRepository.execute(slug, updateParams),
    ).rejects.toThrow("Produto não encontrado");

    expect(mockDb.update).not.toHaveBeenCalled();
  });
});
