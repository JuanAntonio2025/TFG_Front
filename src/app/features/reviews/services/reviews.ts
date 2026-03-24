import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Review } from '../models/review.model';
import { environment } from '../../../../environments/environment';

export interface ReviewsResponse {
  data: Review[];
}

export interface ReviewResponse {
  message: string;
  data: Review;
}

@Injectable({
  providedIn: 'root',
})
export class Reviews {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}`;

  getReviewsByBook(bookId: number): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.apiUrl}/books/${bookId}/reviews`);
  }

  createReview(bookId: number, payload: { points: number; comment: string }): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(`${this.apiUrl}/books/${bookId}/reviews`, payload);
  }

  updateReview(reviewId: number, payload: { points?: number; comment?: string }): Observable<ReviewResponse> {
    return this.http.put<ReviewResponse>(`${this.apiUrl}/reviews/${reviewId}`, payload);
  }

  deleteReview(reviewId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/reviews/${reviewId}`);
  }
}
