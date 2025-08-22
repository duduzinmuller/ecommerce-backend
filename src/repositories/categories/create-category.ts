import { db } from "../../db";
import { categories } from "../../db/schema";
import { Category } from "../../types/category";

export class CreateCategoryRepository {
  async execute(createCategoryParams: Category) {
    const category = await db.insert(categories).values({
      id: createCategoryParams.id,
      name: createCategoryParams.name,
      slug: createCategoryParams.slug,
    });

    return category;
  }
}
