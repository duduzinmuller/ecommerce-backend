export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string; // decimal in database
  stock: number;
  category_id: string;
  image_url: string;
}
