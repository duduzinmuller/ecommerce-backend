import { SlugAlreadyInCreateError } from "../../error/category";
import { UpdateProductParams } from "../../interfaces/product";
import { GetProductBySlugRepository } from "../../repositories/products/get-product-by-slug";
import { UpdateProductRepository } from "../../repositories/products/update-product";

export class UpdateProductUseCase {
  constructor(
    private getProductBySlugRepository: GetProductBySlugRepository,
    private updateProductRepository: UpdateProductRepository,
  ) {
    this.getProductBySlugRepository = getProductBySlugRepository;
    this.updateProductRepository = updateProductRepository;
  }
  async execute(slug: string, updateProductParams: UpdateProductParams) {
    if (updateProductParams.slug) {
      const slugProductIsExists = await this.getProductBySlugRepository.execute(
        updateProductParams.slug,
      );

      if (slugProductIsExists && slugProductIsExists.slug !== slug) {
        throw new SlugAlreadyInCreateError(updateProductParams.slug);
      }
    }

    const product = { ...updateProductParams };

    const updatedProduct = await this.updateProductRepository.execute(
      slug,
      product,
    );

    return updatedProduct;
  }
}
