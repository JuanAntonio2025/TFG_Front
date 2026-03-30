export interface AdminReviewUser {
  user_id: number;
  name: string;
  email?: string;
}

export interface AdminReviewBook {
  book_id: number;
  title: string;
  author: string;
}

export interface AdminReview {
  review_id: number;
  user_id: number;
  book_id: number;
  points: number;
  comment: string;
  date: string;
  user: AdminReviewUser | null;
  book: AdminReviewBook | null;
}
