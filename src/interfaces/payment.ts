export interface Payment {
  id: string;
  order_id: string;
  user_id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: string;

  asaas_payment_id?: string;
  asaas_customer_id?: string;
  qr_code_url?: string;
  invoice_url?: string;
  card_last_digits?: string;
  due_date?: Date;
  installment_count?: number;
  installment_value?: string;
  billing_type?: string;
  card_holder_name?: string;
  card_expiry_month?: string;
  card_expiry_year?: string;
  pix_qr_code?: string;
  pix_key?: string;
  pix_expiration_date?: Date;

  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}

type PaymentMethod = "credit_card" | "pix" | "boleto" | "paypal" | "other";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
