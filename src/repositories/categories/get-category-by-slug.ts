import { eq } from "drizzle-orm";
import { db } from "../../db";
import { categories } from "../../db/schema";

export class GetCategoryBySlugRepository {
  async execute(slug: string) {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug));
    const [category] = result;
    return category ?? null;
  }
}
