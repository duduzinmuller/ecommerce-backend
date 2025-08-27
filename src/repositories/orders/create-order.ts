import { db } from "../../db";
import { orders } from "../../db/schema";
import { Order } from "../../interfaces/order";

export class CreateOrderRepository {
  async execute(createOrderParams: Order) {
    const order = await db.insert(orders).values({
      id: createOrderParams.id,
      user_id: createOrderParams.user_id,
      order_date: createOrderParams.order_date,
      status: createOrderParams.status,
      total: createOrderParams.total,
      delivery_street: createOrderParams.delivery_street,
      delivery_number: createOrderParams.delivery_number,
      delivery_neighborhood: createOrderParams.delivery_neighborhood,
      delivery_complement: createOrderParams.delivery_complement,
      delivery_city: createOrderParams.delivery_city,
      delivery_state: createOrderParams.delivery_state,
      delivery_zip_code: createOrderParams.delivery_zip_code,
      document: createOrderParams.document,
    });

    return order;
  }
}
