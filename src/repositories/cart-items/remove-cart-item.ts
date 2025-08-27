import { eq } from "drizzle-orm";
import { db } from "../../db";
import { cart_items } from "../../db/schema";

export class RemoveCartItemRepository {
  async execute(itemId: string) {
    const [deletedItem] = await db
      .delete(cart_items)
      .where(eq(cart_items.id, itemId))
      .returning();

    return deletedItem;
  }
}
