import {
  CategoryIsNotFound,
  SlugAlreadyInCreateError,
} from "../../error/category";
import { UpdateProductParams } from "../../interfaces/product";
import { GetCategoryByIdRepository } from "../../repositories/categories/get-category-by-id";
import { GetProductBySlugRepository } from "../../repositories/products/get-product-by-slug";
import { UpdateProductRepository } from "../../repositories/products/update-product";

export class UpdateProductUseCase {
  constructor(
    private getProductBySlugRepository: GetProductBySlugRepository,
    private getCategoryByIdRepository: GetCategoryByIdRepository,
    private updateProductRepository: UpdateProductRepository,
  ) {
    this.getProductBySlugRepository = getProductBySlugRepository;
    this.getCategoryByIdRepository = getCategoryByIdRepository;
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

    const category = await this.getCategoryByIdRepository.execute(
      updateProductParams.category_id!,
    );

    if (!category) {
      throw new CategoryIsNotFound();
    }

    const product = { ...updateProductParams };

    const updatedProduct = await this.updateProductRepository.execute(
      slug,
      product,
    );

    return updatedProduct;
  }
}
