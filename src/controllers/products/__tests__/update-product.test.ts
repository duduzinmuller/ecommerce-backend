import { faker } from "@faker-js/faker";
import { UpdateProductController } from "../update-product";
import { UpdateProductUseCase } from "../../../use-cases/products/update-product";
import {
  CategoryIsNotFound,
  SlugAlreadyInCreateError,
} from "../../../error/category";

const mockUpdateProductUseCase = {
  execute: jest.fn(),
} as jest.Mocked<UpdateProductUseCase>;

const updateProductController = new UpdateProductController(
  mockUpdateProductUseCase,
);

describe("UpdateProductController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a product successfully", async () => {
    const mockUpdatedProduct = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      slug: faker.helpers.slugify(faker.commerce.productName()),
      categoryId: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      params: {
        slug: mockUpdatedProduct.slug,
      },
      body: {
        name: mockUpdatedProduct.name,
        description: mockUpdatedProduct.description,
        price: mockUpdatedProduct.price,
        categoryId: mockUpdatedProduct.categoryId,
      },
    };

    mockUpdateProductUseCase.execute.mockResolvedValue(mockUpdatedProduct);

    const result = await updateProductController.execute(httpRequest);

    expect(mockUpdateProductUseCase.execute).toHaveBeenCalledWith(
      httpRequest.params.slug,
      httpRequest.body,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockUpdatedProduct);
  });

  it("should return bad request when slug is missing", async () => {
    const httpRequest = {
      params: {},
      body: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        categoryId: faker.string.uuid(),
      },
    };

    const result = await updateProductController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("Slug é obrigatório");
  });

  it("should return bad request for validation error", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.productName()),
      },
      body: {
        name: "",
        description: "",
        price: -10,
        categoryId: "",
      },
    };

    const result = await updateProductController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("message");
  });

  it("should return bad request for slug already in use", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.productName()),
      },
      body: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        categoryId: faker.string.uuid(),
      },
    };

    mockUpdateProductUseCase.execute.mockRejectedValue(
      new SlugAlreadyInCreateError("Slug já está em uso"),
    );

    const result = await updateProductController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("Slug já está em uso");
  });

  it("should return not found for category not found", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.productName()),
      },
      body: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        categoryId: faker.string.uuid(),
      },
    };

    mockUpdateProductUseCase.execute.mockRejectedValue(
      new CategoryIsNotFound("Categoria não encontrada"),
    );

    const result = await updateProductController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe("Categoria não encontrada");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.productName()),
      },
      body: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        categoryId: faker.string.uuid(),
      },
    };

    mockUpdateProductUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await updateProductController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
