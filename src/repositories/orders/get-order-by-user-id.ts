import { eq } from "drizzle-orm";
import { db } from "src/db";
import { order_items, orders } from "src/db/schema";

export class GetOrderByUserIdRepository {
  async execute(userId: string) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.user_id, userId));

    if (!order) {
      return null;
    }

    const orderItems = await db
      .select({
        ordemItemsId: order_items.id,
        productId: order_items.product_id,
        quantity: order_items.quantity,
        unitPrice: order_items.unit_price,
      })
      .from(order_items)
      .where(eq(order_items.order_id, order.id));

    return { ...order, orderItems };
  }
}
