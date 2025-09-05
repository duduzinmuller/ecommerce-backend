import { z } from "zod";

export const PaymentMethodSchema = z.enum([
  "credit_card",
  "pix",
  "boleto",
  "paypal",
  "other",
]);
export const PaymentStatusSchema = z.enum([
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const PaymentBaseSchema = z.object({
  order_id: z.string().uuid(),
  user_id: z.string().uuid(),
  method: PaymentMethodSchema,
  status: PaymentStatusSchema.optional().default("pending"),
  value: z.string(),
  asaas_payment_id: z.string().max(50).optional(),
  asaas_customer_id: z.string().max(50).optional(),
  qr_code_url: z.string().optional(),
  invoice_url: z.string().optional(),
  card_last_digits: z.string().length(4).optional(),
  due_date: z.date().optional(),
  installment_count: z.number().int().optional(),
  installment_value: z.string().optional(),
  billing_type: z.string().max(20).optional(),
  card_holder_name: z.string().max(100).optional(),
  card_expiry_month: z.string().length(2).optional(),
  card_expiry_year: z.string().length(4).optional(),
  pix_qr_code: z.string().optional(),
  pix_key: z.string().max(100).optional(),
  pix_expiration_date: z.date().optional(),
  paid_at: z.date().optional(),
  created_at: z.date().optional(),
});
