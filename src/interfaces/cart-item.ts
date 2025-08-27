export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
}

export interface CartItemWithProduct extends CartItem {
  product: {
    id: string;
    name: string;
    price: string;
    image_url?: string | null;
  };
}

export interface CreateCartItemRequest {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
