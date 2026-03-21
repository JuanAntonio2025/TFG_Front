export interface ReviewUser {
  user_id: number;
  name: string;
}

export interface Review {
  review_id: number;
  book_id: number;
  user_id: number;
  points: number;
  comment: string;
  date: string;
  user: ReviewUser | null;
}
