import { IdGeneratorAdapter } from "../adapters/id-generator";
import { CreateProductController } from "../controllers/products/create-product";
import { CreateProductRepository } from "../repositories/products/create-product";
import { GetProductBySlugRepository } from "../repositories/products/get-product-by-slug";
import { CreateProductUseCase } from "../use-cases/products/create-product";

export const MakeCreateProductController = () => {
  const createProductRepository = new CreateProductRepository();
  const getProductBySlugRepository = new GetProductBySlugRepository();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const createProductUseCase = new CreateProductUseCase(
    createProductRepository,
    getProductBySlugRepository,
    idGeneratorAdapter,
  );
  const createProductController = new CreateProductController(
    createProductUseCase,
  );
  return createProductController;
};
