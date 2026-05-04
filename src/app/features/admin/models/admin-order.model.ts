export interface AdminOrderBook {
  book_id: number;
  title: string;
  author: string;
  front_page?: string | null;
  front_page_url?: string | null;
  format: 'PDF' | 'EPUB';
  unit_price: number;
}

export interface AdminOrderUser {
  user_id: number;
  name: string;
  email: string;
}

export interface AdminOrder {
  order_id: number;
  user_id: number;
  user: AdminOrderUser | null;
  order_date: string;
  total_amount: number;
  status: string;
  items_count: number;
  items: AdminOrderBook[];
}

export interface AdminOrdersResponse {
  data: AdminOrder[];
}

export interface AdminOrderResponse {
  data: AdminOrder;
}
