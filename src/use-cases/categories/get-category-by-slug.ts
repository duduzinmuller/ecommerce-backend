import { GetCategoryBySlugRepository } from "../../repositories/categories/get-category-by-slug";

export class GetCategoryBySlugUseCase {
  constructor(
    private getCategoryBySlugRepository: GetCategoryBySlugRepository,
  ) {
    this.getCategoryBySlugRepository = getCategoryBySlugRepository;
  }
  async execute(slug: string) {
    const categoryWithProducts =
      await this.getCategoryBySlugRepository.execute(slug);

    return categoryWithProducts;
  }
}
