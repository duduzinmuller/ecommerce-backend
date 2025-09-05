export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  asaas_customer_id?: string;
  created_at: Date;
  updated_at: Date;
}
