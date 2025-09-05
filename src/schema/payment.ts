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
  method: PaymentMethodSchema,
  asaas_customer_id: z.string().max(50),
  pix_key: z.string().max(100).optional(),
  pix_expiration_date: z
    .string()
    .datetime()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  due_date: z
    .string()
    .datetime()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  installment_count: z.number().int().optional(),
  installment_value: z.number().optional(),
  card_holder_name: z.string().max(100).optional(),
  card_number: z.string().optional(),
  card_expiry_month: z.string().length(2).optional(),
  card_expiry_year: z.string().length(4).optional(),
  card_cvv: z.string().length(3).optional(),
  holder_name: z.string().max(100).optional(),
  holder_email: z.string().email().optional(),
  holder_cpf_cnpj: z.string().optional(),
  holder_postal_code: z.string().optional(),
  holder_address_number: z.string().optional(),
  holder_address_complement: z.string().optional(),
  holder_phone: z.string().optional(),
  holder_mobile_phone: z.string().optional(),
  remote_ip: z.string().optional(),
});
