import { Category } from './category.model';
import { Review } from './review.model';

export type BookFormat = 'PDF' | 'EPUB';
export type BookAvailability = 'available' | 'unavailable';

export interface Book {
  book_id: number;
  title: string;
  author: string;
  description?: string | null;
  price: number;
  front_page?: string | null;
  format: BookFormat;
  available: BookAvailability;
  featured?: boolean;
  categories?: Category[];
  reviews?: Review[];
}
