export interface CartItem {
  book_id: number;
  title: string;
  author: string;
  front_page?: string | null;
  front_page_url?: string | null;
  format: string;
  price: number;
  line_total: number;
}

export interface CartSummary {
  items_count: number;
  total_amount: number;
}

export interface CartData {
  cart: {
    cart_id: number;
    user_id: number;
    creation_date: string;
    expiration_date?: string | null;
    active: 'active' | 'closed';
  } | null;
  items: CartItem[];
  summary: CartSummary;
}
