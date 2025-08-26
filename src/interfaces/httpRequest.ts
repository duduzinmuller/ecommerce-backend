export interface HttpRequest {
  params?: {
    userId?: string;
    paymentId?: string;
    provider?: string;
    slug?: string;
    categoryId?: string;
    cartId?: string;
  };
  body?: any;
  user?: string;
  userId?: string;
  file?: string;
  query?: {
    productName?: string;
  };
}
