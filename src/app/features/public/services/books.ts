import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BookDetailResponse } from '../models/book-detail-response.model';
import { BooksResponse } from '../models/books-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Books {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/books`;

  getBooks(filters?: {
    search?: string;
    category_id?: number;
    sort?: string;
    per_page?: number;
    page?: number;
  }): Observable<BooksResponse> {
    let params = new HttpParams();

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.category_id) params = params.set('category_id', filters.category_id);
    if (filters?.sort) params = params.set('sort', filters.sort);
    if (filters?.per_page) params = params.set('per_page', filters.per_page);
    if (filters?.page) params = params.set('page', filters.page);

    return this.http.get<BooksResponse>(this.apiUrl, { params });
  }

  getBookById(bookId: number): Observable<BookDetailResponse> {
    return this.http.get<BookDetailResponse>(`${this.apiUrl}/${bookId}`);
  }

  getFeaturedBooks() {
    return this.http.get<BooksResponse>(`${this.apiUrl}?featured=true`);
  }
}
