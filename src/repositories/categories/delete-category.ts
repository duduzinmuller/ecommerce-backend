import { eq } from "drizzle-orm";
import { db } from "../../db";
import { categories } from "../../db/schema";

export class DeleteCategoryRepository {
  async execute(slug: string) {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug));

    await db.delete(categories).where(eq(categories.slug, slug));

    return category[0];
  }
}
