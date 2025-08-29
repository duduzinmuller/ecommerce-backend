import { faker } from "@faker-js/faker";
import { CreateProductController } from "../create-product";
import { CreateProductUseCase } from "../../../use-cases/products/create-product";
import {
  CategoryIsNotFound,
  SlugAlreadyInCreateError,
} from "../../../error/category";
import { ZodError } from "zod";

const mockCreateProductUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<CreateProductUseCase>;

const createProductController = new CreateProductController(
  mockCreateProductUseCase,
);

describe("CreateProductController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a product successfully", async () => {
    const mockProduct = {
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
      body: {
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price,
        slug: mockProduct.slug,
        categoryId: mockProduct.categoryId,
      },
    };

    mockCreateProductUseCase.execute.mockResolvedValue(mockProduct as any);

    const result = await createProductController.execute(httpRequest);

    expect(mockCreateProductUseCase.execute).toHaveBeenCalledWith(
      httpRequest.body,
    );
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(mockProduct);
  });

  it("should return bad request for validation error", async () => {
    const httpRequest = {
      body: {
        name: "",
        description: "",
        price: -10,
        slug: "",
        categoryId: "",
      },
    };

    const result = await createProductController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("message");
  });

  it("should return not found for category not found", async () => {
    const httpRequest = {
      body: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        slug: faker.helpers.slugify(faker.commerce.productName()),
        categoryId: faker.string.uuid(),
      },
    };

    mockCreateProductUseCase.execute.mockRejectedValue(
      new CategoryIsNotFound(),
    );

    const result = await createProductController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body).toBe("Categoria não encontrada");
  });

  it("should return bad request for slug already in use", async () => {
    const httpRequest = {
      body: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        slug: faker.helpers.slugify(faker.commerce.productName()),
        categoryId: faker.string.uuid(),
      },
    };

    mockCreateProductUseCase.execute.mockRejectedValue(
      new SlugAlreadyInCreateError("Slug já está em uso"),
    );

    const result = await createProductController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("Slug já está em uso");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      body: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        slug: faker.helpers.slugify(faker.commerce.productName()),
        categoryId: faker.string.uuid(),
      },
    };

    mockCreateProductUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await createProductController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
