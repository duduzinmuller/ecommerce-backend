import { IdGeneratorAdapter } from "../adapters/id-generator";
import { CreateProductController } from "../controllers/products/create-product";
import { GetProductBySlugController } from "../controllers/products/get-product-by-slug";
import { GetCategoryByIdRepository } from "../repositories/categories/get-category-by-id";
import { CreateProductRepository } from "../repositories/products/create-product";
import { GetProductBySlugRepository } from "../repositories/products/get-product-by-slug";
import { CreateProductUseCase } from "../use-cases/products/create-product";
import { GetProductBySlugUseCase } from "../use-cases/products/get-product-by-slug";

export const MakeCreateProductController = () => {
  const createProductRepository = new CreateProductRepository();
  const getProductBySlugRepository = new GetProductBySlugRepository();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const getCategoryByIdRepository = new GetCategoryByIdRepository();
  const createProductUseCase = new CreateProductUseCase(
    createProductRepository,
    getProductBySlugRepository,
    idGeneratorAdapter,
    getCategoryByIdRepository,
  );
  const createProductController = new CreateProductController(
    createProductUseCase,
  );
  return createProductController;
};

export const MakeGetProductBySlugController = () => {
  const getProductBySlugRepository = new GetProductBySlugRepository();
  const getProductBySlugUseCase = new GetProductBySlugUseCase(
    getProductBySlugRepository,
  );
  const getProductBySlugController = new GetProductBySlugController(
    getProductBySlugUseCase,
  );
  return getProductBySlugController;
};
