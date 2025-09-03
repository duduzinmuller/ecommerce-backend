import { db } from "../../db";
import { payments } from "../../db/schema";
import { Payment } from "../../interfaces/payment";

export class CreatePaymentRepository {
  async execute(createPaymentParams: Payment) {
    const payment = await db
      .insert(payments)
      .values({
        id: createPaymentParams.id,
        order_id: createPaymentParams.order_id,
        user_id: createPaymentParams.user_id,
        method: createPaymentParams.method,
        status: createPaymentParams.status,
        amount: createPaymentParams.amount,
        paid_at: createPaymentParams.paid_at,
      })
      .returning();

    return payment;
  }
}
