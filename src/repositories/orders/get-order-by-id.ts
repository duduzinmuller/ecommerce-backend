import { db } from "../../db";
import { orders } from "../../db/schema";
import { eq } from "drizzle-orm";

export class GetOrderByIdRepository {
  async execute(orderId: string) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    return order;
  }
}
