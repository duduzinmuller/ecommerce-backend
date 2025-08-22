export interface HttpRequest {
  params?: {
    userId?: string;
    paymentId?: string;
    provider?: string;
    slug?: string;
  };
  body?: any;
  user?: string;
  userId?: string;
  file?: string;
  query?: unknown;
}
