import { IdGeneratorAdapter } from "../../adapters/id-generator";
import { db } from "../../db";
import { order_items } from "../../db/schema";
import { OrderItem } from "../../interfaces/order-item";
export class CreateOrderItemsRepository {
  constructor(private idGeneratorAdapter: IdGeneratorAdapter) {
    this.idGeneratorAdapter = idGeneratorAdapter;
  }

  async execute(orderItems: Omit<OrderItem, "id">[]): Promise<OrderItem[]> {
    const itemsWithIds = await Promise.all(
      orderItems.map(async (item) => ({
        ...item,
        id: await this.idGeneratorAdapter.execute(),
      })),
    );

    await db.insert(order_items).values(itemsWithIds);
    return itemsWithIds;
  }
}
