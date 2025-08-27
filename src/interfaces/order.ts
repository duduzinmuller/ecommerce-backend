export interface Order {
  id: string;
  user_id: string;
  order_date: Date;
  status: OrderStatus;
  total: string;
  delivery_street: string;
  delivery_number: string;
  delivery_neighborhood: string;
  delivery_complement?: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zip_code: string;
  document: string;
}

export type OrderStatus = "pending" | "completed" | "failed" | "canceled";
