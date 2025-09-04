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
        asaas_payment_id: createPaymentParams.asaas_payment_id,
        asaas_customer_id: createPaymentParams.asaas_customer_id,
        qr_code_url: createPaymentParams.qr_code_url,
        invoice_url: createPaymentParams.invoice_url,
        card_last_digits: createPaymentParams.card_last_digits,
        due_date: createPaymentParams.due_date,
        installment_count: createPaymentParams.installment_count,
        installment_value: createPaymentParams.installment_value,
        billing_type: createPaymentParams.billing_type,
        card_holder_name: createPaymentParams.card_holder_name,
        card_expiry_month: createPaymentParams.card_expiry_month,
        card_expiry_year: createPaymentParams.card_expiry_year,
        pix_qr_code: createPaymentParams.pix_qr_code,
        pix_key: createPaymentParams.pix_key,
        pix_expiration_date: createPaymentParams.pix_expiration_date,
        created_at: createPaymentParams.created_at,
      })
      .returning();

    return payment;
  }
}
