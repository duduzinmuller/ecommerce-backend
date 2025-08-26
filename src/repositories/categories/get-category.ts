import { db } from "../../db";
import { eq } from "drizzle-orm";
import { categories, products } from "../../db/schema";

export class GetCategoryRepository {
  async execute() {
    const allCategories = await db.select().from(categories);

    const categoriesWithProducts = await Promise.all(
      allCategories.map(async (category) => {
        const categoryProducts = await db
          .select()
          .from(products)
          .where(eq(products.category_id, category.id));

        return {
          ...category,
          products: categoryProducts,
        };
      }),
    );

    return categoriesWithProducts;
  }
}
