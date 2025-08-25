import { IdGeneratorAdapter } from "../../adapters/id-generator";
import {
  CategoryIsNotFound,
  SlugAlreadyInCreateError,
} from "../../error/category";
import { Product } from "../../interfaces/product";
import { GetCategoryByIdRepository } from "../../repositories/categories/get-category-by-id";
import { CreateProductRepository } from "../../repositories/products/create-product";
import { GetProductBySlugRepository } from "../../repositories/products/get-product-by-slug";

export class CreateProductUseCase {
  constructor(
    private createProductRepository: CreateProductRepository,
    private getProductBySlugRepository: GetProductBySlugRepository,
    private idGeneratorAdapter: IdGeneratorAdapter,
    private getCategoryByIdRepository: GetCategoryByIdRepository,
  ) {
    this.createProductRepository = createProductRepository;
    this.getProductBySlugRepository = getProductBySlugRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.getCategoryByIdRepository = getCategoryByIdRepository;
  }
  async execute(createProductParams: Product) {
    const slugProductIsExists = await this.getProductBySlugRepository.execute(
      createProductParams.slug,
    );
    if (slugProductIsExists) {
      throw new SlugAlreadyInCreateError(createProductParams.slug);
    }
    const productId = await this.idGeneratorAdapter.execute();

    const category = await this.getCategoryByIdRepository.execute(
      createProductParams.category_id,
    );

    if (!category) {
      throw new CategoryIsNotFound();
    }

    const { id, ...restParams } = createProductParams;

    const product = {
      id: productId,
      ...restParams,
    };

    const createdProduct = await this.createProductRepository.execute(product);

    return createdProduct;
  }
}
