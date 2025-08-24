import { eq } from "drizzle-orm";
import { db } from "../../db";
import { categories } from "../../db/schema";

export class GetCategoryByIdRepository {
  async execute(categoryId: string) {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId));
    const [category] = result;
    return category ?? null;
  }
}
