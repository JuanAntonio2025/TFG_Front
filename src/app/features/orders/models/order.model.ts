export interface OrderItem {
  book_id: number;
  title: string;
  author: string;
  front_page?: string | null;
  format: string;
  unit_price: number;
}

export interface Order {
  order_id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'canceled';
  items: OrderItem[];
}
