export interface Payment {
  id: string;
  order_id: string;
  user_id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: string;
  paid_at: Date;
  created_at: Date;
  updated_at: Date;
}

type PaymentMethod = "credit_card" | "pix" | "boleto" | "paypal" | "other";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
