import { eq } from "drizzle-orm";
import { db } from "../../db";
import { categories, products } from "../../db/schema";

export class GetCategoryBySlugRepository {
  async execute(slug: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (!category) return null;

    const categoryProducts = await db
      .select()
      .from(products)
      .where(eq(products.category_id, category.id));

    return { ...category, products: categoryProducts } as typeof category & {
      products: typeof categoryProducts;
    };
  }
}
