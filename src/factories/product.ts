import { IdGeneratorAdapter } from "../adapters/id-generator";
import { CreateProductController } from "../controllers/products/create-product";
import { GetProductByNameController } from "../controllers/products/get-product-by-name";
import { GetProductBySlugController } from "../controllers/products/get-product-by-slug";
import { UpdateProductController } from "../controllers/products/update-product";
import { GetCategoryByIdRepository } from "../repositories/categories/get-category-by-id";
import { CreateProductRepository } from "../repositories/products/create-product";
import { GetProductByNameRepository } from "../repositories/products/get-product-by-name";
import { GetProductBySlugRepository } from "../repositories/products/get-product-by-slug";
import { UpdateProductRepository } from "../repositories/products/update-product";
import { CreateProductUseCase } from "../use-cases/products/create-product";
import { GetProductByNameUseCase } from "../use-cases/products/get-product-by-name";
import { GetProductBySlugUseCase } from "../use-cases/products/get-product-by-slug";
import { UpdateProductUseCase } from "../use-cases/products/update-product";

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

export const MakeGetProductByNameController = () => {
  const getProductByNameRepository = new GetProductByNameRepository();
  const getProductByNameUseCase = new GetProductByNameUseCase(
    getProductByNameRepository,
  );
  const getProductByNameController = new GetProductByNameController(
    getProductByNameUseCase,
  );
  return getProductByNameController;
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

export const MakeUpdateProductController = () => {
  const getProductBySlugRepository = new GetProductBySlugRepository();
  const getCategoryByIdRepository = new GetCategoryByIdRepository();
  const updateProductRepository = new UpdateProductRepository();
  const updateProductUseCase = new UpdateProductUseCase(
    getProductBySlugRepository,
    getCategoryByIdRepository,
    updateProductRepository,
  );
  const updateProductController = new UpdateProductController(
    updateProductUseCase,
  );
  return updateProductController;
};
