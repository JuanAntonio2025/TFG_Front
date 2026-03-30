import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AdminReview } from '../models/admin-review.model';

export interface AdminReviewsResponse {
  data: AdminReview[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminReviews {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/admin/reviews`;

  getReviews(): Observable<AdminReviewsResponse> {
    return this.http.get<AdminReviewsResponse>(this.apiUrl);
  }

  deleteReview(reviewId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${reviewId}`);
  }
}
