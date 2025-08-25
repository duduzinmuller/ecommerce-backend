export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  category_id: string;
  image_url: string;
}

export interface UpdateProductParams {
  name?: string;
  slug?: string;
  description?: string;
  price?: string;
  stock?: number;
  category_id?: string;
  image_url?: string;
}
