import { db } from "../../db";

export class GetCategoryRepository {
  async execute() {
    const category = await db.query.categories.findMany({
      with: {
        products: true,
      },
    });

    return category;
  }
}
