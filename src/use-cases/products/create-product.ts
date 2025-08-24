import { IdGeneratorAdapter } from "../../adapters/id-generator";
import { SlugAlreadyInCreateError } from "../../error/category";
import { Product } from "../../interfaces/product";
import { CreateProductRepository } from "../../repositories/products/create-product";
import { GetProductBySlugRepository } from "../../repositories/products/get-product-by-slug";

export class CreateProductUseCase {
  constructor(
    private createProductRepository: CreateProductRepository,
    private getProductBySlugRepository: GetProductBySlugRepository,
    private idGeneratorAdapter: IdGeneratorAdapter,
  ) {
    this.createProductRepository = createProductRepository;
    this.getProductBySlugRepository = getProductBySlugRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }
  async execute(createProductParams: Product) {
    const slugProductIsExists = await this.getProductBySlugRepository.execute(
      createProductParams.slug,
    );
    if (slugProductIsExists) {
      throw new SlugAlreadyInCreateError(createProductParams.slug);
    }
    const productId = await this.idGeneratorAdapter.execute();

    const { id, ...restParams } = createProductParams;

    const product = {
      id: productId,
      ...restParams,
    };

    const createdProduct = await this.createProductRepository.execute(product);

    return createdProduct;
  }
}
