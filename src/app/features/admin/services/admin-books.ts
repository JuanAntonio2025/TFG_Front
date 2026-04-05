import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Book } from '../../public/models/book.model';
import { environment } from '../../../../environments/environment';

export interface AdminBooksResponse {
  data: Book[];
}

export interface AdminBookResponse {
  message?: string;
  data: Book;
}

@Injectable({
  providedIn: 'root',
})
export class AdminBooks {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/admin/books`;

  getBooks(): Observable<AdminBooksResponse> {
    return this.http.get<AdminBooksResponse>(this.apiUrl);
  }

  getBookById(bookId: number): Observable<AdminBookResponse> {
    return this.http.get<AdminBookResponse>(`${this.apiUrl}/${bookId}`);
  }

  createBook(payload: FormData) {
    return this.http.post<{ message: string; data: Book }>(this.apiUrl, payload);
  }

  updateBook(bookId: number, payload: FormData) {
    return this.http.post<{ message: string; data: Book }>(`${this.apiUrl}/${bookId}`, payload);
  }

  deleteBook(bookId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${bookId}`);
  }
}
