import { GetProductBySlugRepository } from "../../repositories/products/get-product-by-slug";

export class GetProductBySlugUseCase {
  constructor(private getProductBySlugRepository: GetProductBySlugRepository) {
    this.getProductBySlugRepository = getProductBySlugRepository;
  }
  async execute(slug: string) {
    const getProductBySlug =
      await this.getProductBySlugRepository.execute(slug);

    return getProductBySlug;
  }
}
