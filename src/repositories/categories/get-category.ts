import { db } from "../../db";
import { Category } from "../../interfaces/category";

export class GetCategoryRepository {
  async execute(getCategories: Category) {
    const category = await db.query.categories.findMany({
      with: {
        products: true,
      },
    });

    return category;
  }
}
