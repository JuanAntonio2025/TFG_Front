export interface LibraryPurchaseInfo {
  order_id: number;
  purchased_at: string;
  unit_price: number;
}

export interface LibraryBook {
  book_id: number;
  title: string;
  author: string;
  front_page?: string | null;
  format: string;
  available: 'available' | 'unavailable';
  purchase_info: LibraryPurchaseInfo;
}
