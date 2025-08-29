import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { order_items, orders } from "../../db/schema";
import { OrderNotFoundOrUnauthorizedError } from "../../error/order";

export class DeleteOrderRepository {
  async execute(orderId: string, userId: string) {
    const deletedOrder = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.user_id, userId)))
        .limit(1);

      if (!existing) {
        throw new OrderNotFoundOrUnauthorizedError();
      }

      await tx.delete(order_items).where(eq(order_items.order_id, orderId));

      const [order] = await tx
        .delete(orders)
        .where(and(eq(orders.id, orderId), eq(orders.user_id, userId)))
        .returning();

      return order ?? null;
    });

    return deletedOrder;
  }
}
