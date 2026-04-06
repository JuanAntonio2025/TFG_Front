export interface SupportSummaryUser {
  user_id: number;
  name: string;
  email: string;
  status: string;
  register_date: string;
}

export interface SupportSummaryOrder {
  order_id: number;
  order_date: string;
  total_amount: number;
  status: string;
}

export interface SupportSummaryBook {
  book_id: number;
  title: string;
  author: string;
  format: string;
  front_page?: string | null;
  front_page_url?: string | null;
  unit_price: number;
  purchased_at: string;
}

export interface SupportUserSummary {
  user: SupportSummaryUser;
  orders: SupportSummaryOrder[];
  books: SupportSummaryBook[];
}

export interface SupportUserSummaryResponse {
  data: SupportUserSummary;
}
