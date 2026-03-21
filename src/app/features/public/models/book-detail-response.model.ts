import { Book } from './book.model';

export interface BookReviewsSummary {
  avg_points: number | null;
  total_reviews: number;
}

export interface BookDetailData {
  book: Book;
  reviews_summary: BookReviewsSummary;
}

export interface BookDetailResponse {
  data: BookDetailData;
}
