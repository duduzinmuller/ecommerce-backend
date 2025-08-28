import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { orders } from "../../db/schema";
import { OrderParams } from "../../interfaces/order";
import { OrderNotFoundOrUnauthorizedError } from "../../error/order";

export class UpdateOrderRepository {
  async execute(
    orderId: string,
    userId: string,
    updateOrderParams: OrderParams,
  ) {
    const existingOrder = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.user_id, userId)))
      .limit(1);

    if (existingOrder.length === 0) {
      throw new OrderNotFoundOrUnauthorizedError();
    }

    const order = await db
      .update(orders)
      .set({
        ...updateOrderParams,
      })
      .where(and(eq(orders.id, orderId), eq(orders.user_id, userId)))
      .returning();

    return order[0];
  }
}
