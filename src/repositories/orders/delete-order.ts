import { eq } from "drizzle-orm";
import { db } from "../../db";
import { order_items, orders } from "../../db/schema";

export class DeleteOrderRepository {
  async execute(orderId: string) {
    const deletedOrder = await db.transaction(async (tx) => {
      await tx.delete(order_items).where(eq(order_items.order_id, orderId));

      const [order] = await tx
        .delete(orders)
        .where(eq(orders.id, orderId))
        .returning();

      return order ?? null;
    });

    return deletedOrder;
  }
}
